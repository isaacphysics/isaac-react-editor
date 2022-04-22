import React, { ContextType, useContext, useRef, useState } from "react";
import useSWR from "swr";
import { Modal } from "reactstrap";

import { AppContext } from "../App";
import { encodeBase64 } from "../utils/base64";
import { fetcher } from "../services/github";

import styles from "../styles/editor.module.css";
import { PopupMenu, PopupMenuRef } from "./PopupMenu";
import { Entry } from "./FileBrowser";


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

function filePathToEntry(path: string | undefined): Entry {
    const name = path?.substring(path?.lastIndexOf("/") + 1) ?? "";
    return {type: "file", path: path as string, name};
}

export function TopMenu() {
    const menuRef = useRef<PopupMenuRef>(null);
    const appContext = useContext(AppContext);

    const path = appContext.selection.getSelection()?.path;
    const {data, mutate} = useSWR(path && `repos/$OWNER/$REPO/contents/${path}`);

    const [previewOpen, setPreviewOpen] = useState(false);

    return <div className={styles.topMenuWrapper}>
        <button className={styles.iconButton} onClick={(event) => menuRef.current?.open(event, filePathToEntry(path))}>
            ☰ Menu
        </button>
        <div className={styles.flexFill} />
        {appContext.editor.getDirty() &&
            <button className={styles.iconButton} onClick={() => doSave(appContext, data.sha, mutate)}>
                💾 Save
            </button>}
        {appContext.selection.getSelection() && <button className={styles.iconButton} onClick={() => {
            setPreviewOpen(true);
        }}>
            Preview
        </button>}
        <Modal isOpen={previewOpen} onClosed={() => setPreviewOpen(false)}>
            {previewOpen && <pre>{JSON.stringify(appContext.editor.getCurrentDoc(), null, 2)}</pre>}
        </Modal>
        <PopupMenu menuRef={menuRef} />
    </div>;
}
