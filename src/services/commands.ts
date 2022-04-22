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
;

type ActionFor<K> = Action & {type: K};

async function doNew(context: ContextType<typeof AppContext>, action: ActionFor<"new">) {
    let newName = window.prompt("Please type a name for the new file. If no extension is provided, '.json' will be assumed", "untitled");

    if (newName) {
        if (newName.indexOf(".") === -1) {
            newName += ".json";
        }
        const name = newName as string;
        const path = `${action.path}/${newName}`;

        const doCreate = async (initialContent: string) => {
            const encodedContent = encodeBase64(initialContent);
            try {
                const data = await fetcher(`repos/$OWNER/$REPO/contents/${path}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        message: "Creating " + path,
                        branch: context.github.branch,
                        content: encodedContent,
                    }),
                });
                // Let the file browser know this file is there
                await mutate(`repos/$OWNER/$REPO/contents/${action.path}`, (current: Entry[]) => {
                    console.log("mutate, current", current);
                    const newDir = [...current];
                    let position = newDir.findIndex((entry) => {
                        return name < entry.name;
                    });
                    if (position === -1) position = newDir.length;
                    newDir.splice(position, 0, data.content);
                    console.log(newDir);
                    return newDir;
                }, {revalidate: false}); // github asks for aggressive disk caching, which we need to override.
                context.navigate(`/edit/${context.github.branch}/${path}`);
            } catch (e) {
                alert("Couldn't create file. Perhaps it already exists.");
                console.error("Couldn't create file. Perhaps it already exists.", e);
            }
        }

        if (path.endsWith(".json")) {
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

async function doDelete(context: ContextType<typeof AppContext>, action: ActionFor<"delete">) {
    if (window.confirm("Do you really want to delete " + action.name + "?")) {
        const path = action.path;
        const name = action.name;
        const basePath = path.substring(0, path.length - name.length - 1);

        await fetcher(`repos/$OWNER/$REPO/contents/${path}`, {
            method: "DELETE",
            body: JSON.stringify({
                message: "Deleting " + path,
                branch: context.github.branch,
                sha: action.sha,
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
        context.navigate(`/edit/${context.github.branch}/${basePath}/`);
    }
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
    }
}
