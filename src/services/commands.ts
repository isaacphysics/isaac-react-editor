import { ContextType } from "react";
import { mutate } from "swr";

import { AppContext } from "../App";
import { dirname, generateGuid } from "../utils/strings";
import { ContentType } from "../components/semantic/registry";

import { githubSave, githubCreate, githubDelete } from "./github";
import { EMPTY_DOCUMENTS } from "./emptyDocuments";

export const defaultDispatch: (action: Action) => void = () => {
    throw new Error("dispatch called from outside AppContext");
};

export type Action =
    | {type: "openInNewTab"; path: string}
    | {type: "new"; path: string}
    | {type: "delete"; path: string; name: string; sha: string}
    | {type: "rename"; path: string; name: string; sha: string}
    | {type: "saveAs"; path: string; name: string}
;

type ActionFor<K> = Action & {type: K};

async function doNew(context: ContextType<typeof AppContext>, action: ActionFor<"new">) {
    let newName = window.prompt("Please type a name for the new file. If no extension is provided, '.json' will be assumed", "untitled");

    if (newName) {
        if (newName.indexOf(".") === -1) {
            newName += ".json";
        }
        const name = newName as string;
        const path = action.path;

        const doCreate = async (initialContent: string) => {
            try {
                await githubCreate(context, action.path, name, initialContent);
                context.navigate(`/edit/${context.github.branch}/${path}/${name}`);
            } catch (e) {
                alert("Couldn't create file. Perhaps it already exists.");
                console.error("Couldn't create file. Perhaps it already exists.", e);
            }
        }

        if (name.endsWith(".json")) {
            await new Promise<void>((resolve) => {
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
                            await doCreate(JSON.stringify(doc, null, 2));
                        }
                        resolve();
                    },
                });
            });
        } else {
            await doCreate("");
        }
    }
}

async function doDelete(context: ContextType<typeof AppContext>, action: ActionFor<"delete">) {
    if (window.confirm("Do you really want to delete " + action.name + "?")) {
        await githubDelete(context, action.path, action.name, action.sha);
        context.navigate(`/edit/${context.github.branch}/${dirname(action.path)}/`);
    }
}

async function doRename(context: ContextType<typeof AppContext>, action: ActionFor<"rename">) {
    let sha = action.sha;
    if (context.editor.getDirty()) {
        if (!window.confirm("This will save the current contents of this file. Are you sure you want to continue?")) {
            return;
        }
        const newContent = await githubSave(context, action.sha, (newData, revalidate) => {
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

        const basePath = dirname(oldPath);

        try {
            await githubCreate(context, basePath, newName, JSON.stringify(context.editor.getCurrentDoc(), null, 2));
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

async function doSaveAs(context: ContextType<typeof AppContext>, action: ActionFor<"saveAs">) {
    let newName = window.prompt("Please type a new name for the file. If no extension is provided, \".json\" will be assumed", action.name);
    if (newName && newName !== action.name) {
        const oldPath = action.path;
        if (newName.indexOf(".") === -1 && oldPath.toLowerCase().endsWith(".json"))
            newName += ".json";
        const basePath = dirname(oldPath);
        const newPath = basePath + "/" + newName;
        const alteredContent = {
            ...context.editor.getCurrentDoc(),
            author: (await context.github.user).login,
            id: generateGuid(),
            published: false,
        };
        context.editor.loadNewDoc(alteredContent); // Slightly dirty way to clear dirty flag
        const content = JSON.stringify(alteredContent, null, 2);

        githubCreate(context, basePath, newName, content).then(function(f) {
            context.navigate(`/edit/${context.github.branch}/${newPath}`);
        }).catch(function(e) {
            window.alert("Could not create file. Perhaps it already exists.");
            console.log(e);
        });
    }

}

export async function doDispatch(context: ContextType<typeof AppContext>, action: Action) {
    switch (action.type) {
        case "openInNewTab":
            window.open(`/edit/${context.github.branch}/${action.path}`, "_blank");
            return;
        case "new":
            await doNew(context, action);
            return;
        case "delete":
            await doDelete(context, action);
            return;
        case "rename":
            await doRename(context, action);
            return;
        case "saveAs":
            await doSaveAs(context,action);
            return;
    }
}
