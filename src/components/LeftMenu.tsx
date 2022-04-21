import React, { ContextType, useContext, useLayoutEffect, useState } from "react";
import useSWR from "swr";
import { Modal } from "reactstrap";

import { AppContext } from "../App";
import { encodeBase64 } from "../utils/base64";
import { FileBrowser } from "./FileBrowser";
import { fetcher } from "../services/github";

import styles from "../styles/editor.module.css";


/*function dirname(path: string | undefined) {
    if (!path) return path;
    return path.substring(0, path.lastIndexOf('/'));
}*/

async function doSave(appContext: ContextType<typeof AppContext>, sha: string, mutate: (data?: unknown, update?: boolean) => void) {
    // Commit this to github
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
    mutate({...result.content, content: body.content}, false);
}

export function LeftMenu() {
    const appContext = useContext(AppContext);

    const path = appContext.selection.getSelection()?.path;
    const {data, mutate} = useSWR(path && `repos/$OWNER/$REPO/contents/${path}`);

    const [previewOpen, setPreviewOpen] = useState(false);

    // Run this on first load only
    useLayoutEffect(() => {
        function tryAgain() {
            const item = document.getElementById(`fileItem-${path}`);
            if (item) {
                item.scrollIntoView({block: "center"});
            } else {
                if (path === appContext.selection.getSelection()?.path) {
                    setTimeout(tryAgain, 250);
                }
            }
        }
        if (path) {
            tryAgain();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div className={styles.leftMenuWrapper}>
        <header className={styles.leftMenuHeader}>
            {/*<button onClick={() => {
                const selection = appContext.selection.getSelection();
                const basePath = selection?.isDir ? selection?.path : dirname(selection?.path);
                alert(`Adding at path: ${basePath}`);
            }}>
                Add
            </button>*/}
            <button className={styles.iconButton} onClick={() => {
                const selection = appContext.selection.getSelection();
                if (selection) {
                    const item = document.getElementById(`fileItem-${selection.path}`);
                    item?.scrollIntoView({block: "center"});
                }
            }}>🔍</button>
            {appContext.editor.getDirty() && <button onClick={() => doSave(appContext, data.sha, mutate)}>
                Save
            </button>}
            {appContext.selection.getSelection() && <button onClick={() => {
                setPreviewOpen(true);
            }}>
                Preview
            </button>}
        </header>
        <FileBrowser/>
        <Modal isOpen={previewOpen} onClosed={() => setPreviewOpen(false)}>
            {previewOpen && <pre>{JSON.stringify(appContext.editor.getCurrentDoc(), null, 2)}</pre>}
        </Modal>
    </div>;
}
