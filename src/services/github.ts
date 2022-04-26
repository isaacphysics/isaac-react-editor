import { ContextType } from "react";
import Cookies from "js-cookie";
import useSWR, { mutate, Cache } from "swr";

import { Config, doAuth, getConfig } from "./auth";
import { AppContext } from "../App";
import { encodeBase64 } from "../utils/base64";
import { Entry } from "../components/FileBrowser";
import { dirname } from "../utils/strings";

export const GITHUB_TOKEN_COOKIE = "github-token";

export const fetcher = async (path: string, options?: Omit<RequestInit, "body"> & {body: Record<string, unknown>}) => {
    const config = getConfig();
    const fullPath = "https://api.github.com/" + path.replace(/\$([A-Z_]+)/g, (_, match) => {
        return config[match as keyof Config];
    });

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
        throw json.message;
    }
};

function contentsPath(path: string, branch?: string) {
    let fullPath = `repos/$OWNER/$REPO/contents/${path}`;
    if (branch) {
        fullPath += `?ref=${branch}`;
    }
    return fullPath;
}

export const useGithubContents = (context: ContextType<typeof AppContext>, path: string|false|null|undefined) => {
    return useSWR(typeof path === "string" ? contentsPath(path, context.github.branch) : null);
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
            dest.pathname = "edit/master";
        }
        // Either way, take code out of query string
        dest.searchParams.delete("code");
        window.location.replace(dest);
    }
}

export interface User {
    login: string;
}

export const defaultGithubContext = {
    branch: "master",
    user: new Promise<User>((resolve) => resolve({login: "invalid-user" as string})),
    cache: undefined as unknown as Cache,
};

export async function githubCreate(context: ContextType<typeof AppContext>, basePath: string, name: string, initialContent: string) {
    const path = `${basePath}/${name}`;
    const data = await fetcher(contentsPath(path), {
        method: "PUT",
        body: {
            branch: context.github.branch,
            message: "Creating " + path,
            content: encodeBase64(initialContent),
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
}

export async function githubDelete(context: ContextType<typeof AppContext>, path: string, name: string, sha: string) {
    const basePath = dirname(path);
    await fetcher(contentsPath(path), {
        method: "DELETE",
        body: {
            branch: context.github.branch,
            message: "Deleting " + path,
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

    const {sha} = context.github.cache.get(contentsPath(path, context.github.branch));

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
