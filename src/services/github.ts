import {ContextType} from "react";
import Cookies from "js-cookie";
import useSWR, {Cache, mutate} from "swr";

import {authorizationURL, doAuth} from "./auth";
import {AppContext} from "../App";
import {encodeBase64} from "../utils/base64";
import {Entry} from "../components/FileBrowser";
import {dirname} from "../utils/strings";
import {Config, getConfig} from "./config";

export const GITHUB_TOKEN_COOKIE = "github-token";
const GITHUB_API_URL = "https://api.github.com/";

export function githubReplaceWithConfig(path: string) {
    const config = getConfig();
    return path.replace(/\$([A-Z_]+)/g, (_, match) => {
        return config[match as keyof Config];
    });
}

// GitHub asks the browser to cache some of its responses for 60 seconds, so situations like the following can occur:
//  - User loads the app and latest content
//  - User deletes a file
//  - User reloads the page
//  - Content is fetched again, but is retrieved from the browser cache because the request is the same
//  - File that the user just deleted is back again
//  - Attempts to interact with this file (save, rename, etc.) might result in weird behaviour
//
// We could circumvent this by adding a timestamp query param to every request so the browser caches them separately,
// but GitHub really wouldn't want us to do this, and this kind of issue only arises when the page is reloaded. The
// content teams were presumably coping with this problem in the old editor, so we have decided *not* to fix it.
export const fetcher = async (path: string, options?: Omit<RequestInit, "body"> & {body?: Record<string, unknown>}) => {
    const fullPath = GITHUB_API_URL + githubReplaceWithConfig(path);
    const result = await fetch(fullPath, {
        ...options,
        headers: {
            ...options?.headers,
            authorization: `token ${Cookies.get(GITHUB_TOKEN_COOKIE)}`,
        },
        body: options?.body && JSON.stringify({
            ...options.body,
        }),
    });
    const json = await result.json();
    if (result.ok) {
        return json;
    } else {
        if (result.status === 401) {
            // Re-login is needed
            if (window.confirm("You need to login again. We'll do that in a new window so your changes aren't lost.")) {
                window.open(authorizationURL(`${document.location.origin}/login_finished`), "_blank");
            }
        }
        throw json.message;
    }
};

function contentsPath(path: string, branch?: string) {
    let fullPath = `repos/$OWNER/$REPO/contents/${path}`;
    if (branch) {
        fullPath += `?ref=${encodeURIComponent(branch)}`;
    }
    return fullPath;
}

export const useGithubContents = (context: ContextType<typeof AppContext>, path: string|false|null|undefined) => {
    return useSWR(typeof path === "string" ? contentsPath(path, context.github.branch) : null);
};

export const defaultGithubContext = {
    branch: "master",
    user: {login: "invalid-user"} as User,
    cache: undefined as unknown as Cache,
};

export async function processCode(code: string | null) {
    if (code) {
        // Exchange the code for a token, put that in a cookie
        const result = await doAuth(code);
        Cookies.set(GITHUB_TOKEN_COOKIE, result.access_token, {
            expires: 7,
            sameSite: "strict",
        });

        const dest = new URL(window.location.href);
        if (dest.pathname === "" || dest.pathname === "/") {
            dest.pathname = `edit/${encodeURIComponent(defaultGithubContext.branch)}`;
        }
        // Either way, take code out of query string
        dest.searchParams.delete("code");
        window.location.replace(dest);
    }
}

export interface User {
    login: string;
}

export function githubComparisonPath(oldVersion?: string, newVersion?: string) {
    return githubReplaceWithConfig("https://github.com/$OWNER/$REPO/compare/" + oldVersion + "..." + newVersion);
}

export async function githubCreate(context: ContextType<typeof AppContext>, basePath: string, name: string, initialContent: string) {
    const path = `${basePath}/${name}`;

    // If we have a binary file, we want to do the conversion as the binary file, so use the standard btoa
    // But if there are any >255 characters in there, this must be UTF text so we use the encoder that
    // first turns UTF-16 into UTF-8 as UTF-16 can't be encoded as base64 (since some "bytes" are > 255).
    let content;
    try {
        content = window.btoa(initialContent);
    } catch (e) {
        content = encodeBase64(initialContent);
    }

    const data = await fetcher(contentsPath(path), {
        method: "PUT",
        body: {
            branch: context.github.branch,
            message: "Creating " + path,
            content,
        },
    });

    // Let the file browser know this file is there
    await mutate(contentsPath(basePath, context.github.branch), (current: Entry[]) => {
        const newDir = [...current ?? []];
        let position = newDir.findIndex((entry) => {
            return name < entry.name;
        });
        if (position === -1) position = newDir.length;
        newDir.splice(position, 0, data.content);
        return newDir;
    }, {revalidate: false}); // github asks for aggressive disk caching, which we need to override.

    return data;
}

export async function githubDelete(context: ContextType<typeof AppContext>, path: string, name: string, sha: string) {
    let wasPublished;
    try {
        wasPublished = context.editor.isAlreadyPublished();
    } catch {
        wasPublished = false;
    }
    const basePath = dirname(path);
    await fetcher(contentsPath(path), {
        method: "DELETE",
        body: {
            branch: context.github.branch,
            message: `${wasPublished ? "* " : ""}Deleting ${path}`,
            sha: sha,
        },
    });

    // Let the file browser know this file is no longer there
    await mutate(contentsPath(basePath, context.github.branch), (current: Entry[]) => {
        const newDir = [...current];
        const position = newDir.findIndex((entry) => {
            return name === entry.name;
        });
        if (position !== -1) {
            newDir.splice(position, 1);
            return newDir;
        }
        return current;
    }, {revalidate: false}); // github asks for aggressive disk caching, which we need to override.
}

// Adapted from this blog post: https://medium.com/@obodley/renaming-a-file-using-the-git-api-fed1e6f04188
export async function githubRename(context: ContextType<typeof AppContext>, path: string, name: string) {
    const isPublished = context.editor?.isAlreadyPublished();
    const pathSegments = path.split("/");
    const basePath = dirname(path);
    const oldName = pathSegments.at(-1);

    // Ensure that another file with the same name doesn't already exist, because the renaming process will overwrite
    // existing files otherwise. First we clear the cache to ensure that the file list is up to date (at least within
    // the last 60 seconds).
    await mutate(contentsPath(basePath, context.github.branch), undefined);
    const current: Entry[] = await context.github.cache.get(contentsPath(basePath, context.github.branch));
    const index = current.findIndex((entry) => name === entry.name);
    if (index !== -1) throw Error(`A file with the name ${name} already exists in the same directory. Cannot rename!`);

    // It is now safe to rename...

    // Get the current branch commit sha - GitHub asks the browser to cache these branch requests for 60 seconds, which will
    // cause things to break if we try to rename twice in a 60 second period. To bypass this, we add a timestamp as a
    // query param to the URL, allowing us to get the freshest branch commit sha each time.
    const branch = await fetcher(`repos/$OWNER/$REPO/branches/${encodeURIComponent(context.github.branch)}?cache_t=${Date.now()}`);
    const baseSha = branch.commit.sha;
    // Get the entire git tree at this point
    let subtree = await fetcher(`repos/$OWNER/$REPO/git/trees/${baseSha}`);
    // Find the tree node corresponding to the file we want to rename
    for (const segment of pathSegments.slice(0, -1)) {
        const nextTree = subtree.tree.find((t: any) => t.path === segment);
        if (nextTree) {
            subtree = await fetcher(nextTree.url.replace(GITHUB_API_URL, ""));
        } else {
            console.error("Cannot find file in git tree - cannot rename!");
            return;
        }
    }

    const blob = subtree?.tree?.find((b: any) => b.path === oldName);
    if (!blob) throw Error("A file with that name does not exist on the current branch.");

    // Send the modified tree to github, with the updated path
    const newTree = await fetcher(`repos/$OWNER/$REPO/git/trees?recursive=1`,{
        method: "POST",
        body: {
            "base_tree": baseSha,
            "tree": [
                {
                    "path": `${basePath}/${name}`,
                    "mode": blob.mode,
                    "type": blob.type,
                    "sha": blob.sha
                },
                {
                    "path": `${basePath}/${blob.path}`,
                    "mode": blob.mode,
                    "type": blob.type,
                    "sha": null
                }
            ]
        }
    });

    // Commit the new tree with a message
    const commit = await fetcher(`repos/$OWNER/$REPO/git/commits`, {
        method: "POST",
        body: {
            "message": `${isPublished ? "* " : ""}Rename ${blob.path} to ${name}`,
            "tree": newTree.sha,
            "parents": [baseSha]
        }
    });
    // Point the current branch at the new commit
    await fetcher(`repos/$OWNER/$REPO/git/refs/heads/${encodeURIComponent(context.github.branch)}`, {
        method: "PATCH",
        body: {
            "sha": commit.sha
        }
    });

    // This essentially merges the create and delete mutations
    await mutate(contentsPath(basePath, context.github.branch), (current: Entry[]) => {
        const newDir = [...current];
        const oldPosition = newDir.findIndex((entry) => {
            return oldName === entry.name;
        });
        const oldFileData = {...current[oldPosition]};
        if (oldPosition !== -1) {
            newDir.splice(oldPosition, 1);
        }
        let newPosition = newDir.findIndex((entry) => {
            return name < entry.name;
        });
        if (newPosition === -1) newPosition = newDir.length;
        newDir.splice(newPosition, 0, {...oldFileData, name: name, path: `${basePath}/${name}`});
        return newDir;
    }, {revalidate: false}); // github asks for aggressive disk caching, which we need to override.
}

export async function githubSave(context: ContextType<typeof AppContext>) {
    let isPublishedChange;
    let isContent;
    try {
        const fileJSON = context.editor.getCurrentDoc();
        const alreadyPublished = context.editor.isAlreadyPublished();
        isPublishedChange = fileJSON.published || alreadyPublished;
        isContent = true;
    } catch {
        isPublishedChange = false;
        isContent = false;
    }
    const path = context.selection.getSelection()?.path as string;
    const initialCommitMessage = `${isPublishedChange ? "* " : ""}Edited ${path}`;

    const message = window.prompt("Enter your commit message", initialCommitMessage);

    if (!message) {
        return;
    }

    const {sha} = await context.github.cache.get(contentsPath(path, context.github.branch));

    const body = {
        message,
        branch: context.github.branch,
        content: encodeBase64(context.editor.getCurrentDocAsString()),
        sha: sha,
    }

    const result = await fetcher(contentsPath(path), {
        method: "PUT",
        body,
    });

    // Clear dirty and update already published flags
    context.editor.loadNewDoc(isContent ? context.editor.getCurrentDoc() : context.editor.getCurrentDocAsString());
    const newContent = {...result.content, content: body.content};
    await mutate(contentsPath(path, context.github.branch), newContent, {revalidate: false});

    return newContent;
}

export async function githubUpload(context: ContextType<typeof AppContext>, basePath: string, name: string, content: string): Promise<string> {
    const figurePath = `${basePath}/figures`;

    let existingFigures;
    try {
        existingFigures = await fetcher(contentsPath(figurePath, context.github.branch));
    } catch (e) {
        existingFigures = [];
    }

    const figurePaths: string[] = existingFigures.map((f: { path: string; }) => f.path);
    let i = 0;
    let proposedName, proposedPath;
    do {
        proposedName = name.substring(0, name.lastIndexOf(".")) + ( i ? "_" + (i+1) : "") + name.substring(name.lastIndexOf("."));
        proposedPath = figurePath + "/" + proposedName;
        i++;
    } while(figurePaths.includes(proposedPath))

    const result = await githubCreate(context,  figurePath, proposedName, content);

    return `figures/${result.content.name}`;
}
