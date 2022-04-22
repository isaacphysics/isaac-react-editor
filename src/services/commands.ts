import { ContextType } from "react";
import { mutate } from "swr";

import { AppContext } from "../App";
import { encodeBase64 } from "../utils/base64";
import { generateGuid } from "../utils/strings";
import { ContentType } from "../components/semantic/registry";

import { fetcher } from "./github";
import { EMPTY_DOCUMENTS } from "./emptyDocuments";
import { Entry } from "../components/FileBrowser";

export const defaultDispatch: (action: Action) => void = () => {
    throw new Error("dispatch called from outside AppContext");
};

export type Action =
    | {type: "openInNewTab"; path: string}
    | {type: "new"; path: string}
    | {type: "delete"; path: string; name: string; sha: string}
    | {type: "rename"; path: string; name: string; sha: string}
;

type ActionFor<K> = Action & {type: K};

async function githubCreate(context: React.ContextType<typeof AppContext>, basePath: string, name: string, encodedContent: string) {
    const path = `${basePath}/${name}`;
    const data = await fetcher(`repos/$OWNER/$REPO/contents/${path}`, {
        method: "PUT",
        body: JSON.stringify({
            message: "Creating " + path,
            branch: context.github.branch,
            content: encodedContent,
        }),
    });
    // Let the file browser know this file is there
    await mutate(`repos/$OWNER/$REPO/contents/${basePath}`, (current: Entry[]) => {
        const newDir = [...current ?? []];
        let position = newDir.findIndex((entry) => {
            return name < entry.name;
        });
        if (position === -1) position = newDir.length;
        newDir.splice(position, 0, data.content);
        return newDir;
    }, {revalidate: false}); // github asks for aggressive disk caching, which we need to override.
}

async function doNew(context: ContextType<typeof AppContext>, action: ActionFor<"new">) {
    let newName = window.prompt("Please type a name for the new file. If no extension is provided, '.json' will be assumed", "untitled");

    if (newName) {
        if (newName.indexOf(".") === -1) {
            newName += ".json";
        }
        const name = newName as string;
        const path = action.path;

        const doCreate = async (initialContent: string) => {
            const encodedContent = encodeBase64(initialContent);
            try {
                await githubCreate(context, action.path, name, encodedContent);
                context.navigate(`/edit/${context.github.branch}/${path}/${name}`);
            } catch (e) {
                alert("Couldn't create file. Perhaps it already exists.");
                console.error("Couldn't create file. Perhaps it already exists.", e);
            }
        }

        if (name.endsWith(".json")) {
            context.menuModal.current?.open({
                title: "Choose Page Type",
                body: "What type of page would you like to create?",
                options: [
                    {
                        caption: "Wildcard",
                        value: "isaacWildcard"
                    },
                    {
                        caption: "Question",
                        value: "isaacQuestionPage"
                    },
                    {
                        caption: "FastTrack Question",
                        value: "isaacFastTrackQuestionPage"
                    },
                    {
                        caption: "Concept",
                        value: "isaacConceptPage"
                    },
                    {
                        caption: "Topic Summary",
                        value: "isaacTopicSummaryPage"
                    },
                    {
                        caption: "Quiz",
                        value: "isaacQuiz"
                    },
                    {
                        caption: "General",
                        value: "page"
                    },
                    {
                        caption: "Event",
                        value: "isaacEventPage"
                    },
                    {
                        caption: "Email template",
                        value: "emailTemplate"
                    },
                    {
                        caption: "News pod",
                        value: "isaacPod"
                    },
                    {
                        caption: "Card",
                        value: "isaacCard"
                    },
                    {
                        caption: "Card deck",
                        value: "isaacCardDeck"
                    },
                ],
                callback: async (option) => {
                    if (option === null) {
                        console.log("File creation cancelled.");
                    } else {
                        const doc = {
                            ...EMPTY_DOCUMENTS[option.value as ContentType],
                            author: (await context.github.user).login,
                            id: generateGuid(),
                        };
                        doCreate(JSON.stringify(doc, null, 2));
                    }
                },
            });
        } else {
            await doCreate("");
        }
    }
}

function getBasePath(path: string) {
    return path.substring(0, path.lastIndexOf("/"));
}

async function githubDelete(context: React.ContextType<typeof AppContext>, path: string, name: string, sha: string) {
    const basePath = getBasePath(path);
    await fetcher(`repos/$OWNER/$REPO/contents/${path}`, {
        method: "DELETE",
        body: JSON.stringify({
            message: "Deleting " + path,
            branch: context.github.branch,
            sha: sha,
        }),
    });

    // Let the file browser know this file is no longer there
    await mutate(`repos/$OWNER/$REPO/contents/${basePath}`, (current: Entry[]) => {
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

async function doDelete(context: ContextType<typeof AppContext>, action: ActionFor<"delete">) {
    if (window.confirm("Do you really want to delete " + action.name + "?")) {
        await githubDelete(context, action.path, action.name, action.sha);
        context.navigate(`/edit/${context.github.branch}/${getBasePath(action.path)}/`);
    }
}

async function doRename(context: ContextType<typeof AppContext>, action: ActionFor<"rename">) {
    let sha = action.sha;
    if (context.editor.getDirty()) {
        if (!window.confirm("This will save the current contents of this file. Are you sure you want to continue?")) {
            return;
        }
        const newContent = await doSave(context, action.sha, (newData, revalidate) => {
            mutate(`repos/$OWNER/$REPO/contents/${action.path}`, newData, {revalidate});
        });
        sha = newContent.sha;
    }

    let newName = window.prompt("Please type a new name for the file. If no extension is provided, \".json\" will be assumed", action.name);

    if (newName) {
        const oldPath = action.path;

        if (newName.indexOf(".") === -1 && oldPath.toLowerCase().endsWith(".json")) {
            newName += ".json";
        }

        const basePath = getBasePath(oldPath);

        try {
            await githubCreate(context, basePath, newName, encodeBase64(JSON.stringify(context.editor.getCurrentDoc(), null, 2)));
            try {
                await githubDelete(context, oldPath, action.name, sha);
                context.navigate(`/edit/${context.github.branch}/${basePath}/${newName}`)
            } catch (e) {
                console.error("Could not delete old file.", e);
            }
        } catch (e) {
            window.alert("Could not create file. Perhaps it already exists.");
            console.log(e);
        }
    }
}

export async function doSave(appContext: ContextType<typeof AppContext>, sha: string, mutate: (data?: unknown, update?: boolean) => void) {
    const fileJSON = appContext.editor.getCurrentDoc();
    const alreadyPublished = appContext.editor.isAlreadyPublished();
    const isPublishedChange = fileJSON.published || alreadyPublished;
    const path = appContext.selection.getSelection()?.path;
    const initialCommitMessage = `${isPublishedChange ? "* " : ""}Edited ${path}`;

    const message = window.prompt("Enter your commit message", initialCommitMessage);

    if (!message) {
        return;
    }

    const body = {
        message,
        content: encodeBase64(JSON.stringify(fileJSON)),
        //branch: // TODO: handle branch here and also at fetcher
        sha: sha,
    }

    const result = await fetcher(`repos/$OWNER/$REPO/contents/${path}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });

    appContext.editor.loadNewDoc(fileJSON);
    const newContent = {...result.content, content: body.content};
    mutate(newContent, false);

    return newContent;
}

export function doDispatch(context: ContextType<typeof AppContext>, action: Action) {
    switch (action.type) {
        case "openInNewTab":
            window.open(`/edit/${context.github.branch}/${action.path}`, "_blank");
            return;
        case "new":
            doNew(context, action);
            return;
        case "delete":
            doDelete(context, action);
            return;
        case "rename":
            doRename(context, action);
            return;
    }
}
