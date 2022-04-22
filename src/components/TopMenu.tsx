import React, { useContext, useRef, useState } from "react";
import useSWR from "swr";
import { Modal } from "reactstrap";

import { AppContext } from "../App";

import styles from "../styles/editor.module.css";
import { PopupMenu, PopupMenuRef } from "./PopupMenu";
import { Entry } from "./FileBrowser";
import { doSave } from "../services/commands";


function filePathToEntry(path: string | undefined, sha: string): Entry {
    const name = path?.substring(path?.lastIndexOf("/") + 1) ?? "";
    return {type: "file", path: path as string, name, sha};
}

export function TopMenu() {
    const menuRef = useRef<PopupMenuRef>(null);
    const appContext = useContext(AppContext);

    const path = appContext.selection.getSelection()?.path;
    const {data, mutate} = useSWR(path && `repos/$OWNER/$REPO/contents/${path}`);

    const [previewOpen, setPreviewOpen] = useState(false);

    return <div className={styles.topMenuWrapper}>
        <button className={styles.iconButton} onClick={(event) => menuRef.current?.open(event, filePathToEntry(path, data.sha))}>
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
