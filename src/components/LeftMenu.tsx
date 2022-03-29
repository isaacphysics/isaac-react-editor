import React, { ContextType, useContext, useState } from "react";
import useSWR from "swr";
import { Modal } from "reactstrap";

import { AppContext } from "../App";
import { encodeBase64 } from "../utils/base64";
import { FileBrowser } from "./FileBrowser";
import { fetcher } from "../services/github";


/*function dirname(path: string | undefined) {
    if (!path) return path;
    return path.substring(0, path.lastIndexOf('/'));
}*/

async function doSave(appContext: ContextType<typeof AppContext>, sha: string, mutate: (data?: unknown, update?: boolean) => void) {
    // Commit this to github
    const fileText = appContext.editor.currentRef.current;
    const fileJSON = JSON.parse(fileText);
    const existingJSON = JSON.parse(appContext.editor.previousRef.current);
    const isPublishedChange = fileJSON.published || existingJSON.published;
    const path = appContext.selection.getSelection()?.path;
    const initialCommitMessage = `${isPublishedChange ? "* " : ""}Edited ${path}`;

    const message = window.prompt("Enter your commit message", initialCommitMessage);

    if (!message) {
        return;
    }

    const body = {
        message,
        content: encodeBase64(fileText),
        //branch: // TODO: handle branch here and also at fetcher
        sha: sha,
    }

    const result = await fetcher(`repos/$OWNER/$REPO/contents/${path}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });

    appContext.editor.setDirty(false);
    mutate({...result.content, content: body.content}, false);
}

export function LeftMenu() {
    const appContext = useContext(AppContext);

    const path = appContext.selection.getSelection()?.path;
    const {data, mutate} = useSWR(path && `repos/$OWNER/$REPO/contents/${path}`);

    const [previewOpen, setPreviewOpen] = useState(false);

    return <div style={{
        width: "300px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0
    }}>
        <header style={{textAlign: "right", minHeight: "30px", background: "#f5f5f5"}}>
            {/*<button onClick={() => {
                const selection = appContext.selection.getSelection();
                const basePath = selection?.isDir ? selection?.path : dirname(selection?.path);
                alert(`Adding at path: ${basePath}`);
            }}>
                Add
            </button>*/}
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
            {previewOpen && <pre>{appContext.editor.currentRef.current}</pre>}
        </Modal>
    </div>;
}
