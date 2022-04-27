import React, { useContext, useRef, useState } from "react";
import { Modal } from "reactstrap";

import { AppContext } from "../App";
import { useGithubContents } from "../services/github";

import { PopupMenu, PopupMenuRef } from "./PopupMenu";
import { Entry } from "./FileBrowser";

import styles from "../styles/editor.module.css";

function filePathToEntry(path: string | undefined, sha: string): Entry {
    const name = path?.substring(path?.lastIndexOf("/") + 1) ?? "";
    return {type: "file", path: path as string, name, sha};
}

export function TopMenu({previewable}: {previewable?: boolean}) {
    const menuRef = useRef<PopupMenuRef>(null);
    const appContext = useContext(AppContext);

    const selection = appContext.selection.getSelection();
    const {data} = useGithubContents(appContext, selection?.path);

    return <div className={styles.topMenuWrapper}>
        <button className={styles.iconButton} onClick={(event) => selection && menuRef.current?.open(event, filePathToEntry(selection.path, data.sha))}>
            ☰ Menu
        </button>
        <div className={styles.flexFill} />
        {appContext.editor.getDirty() &&
            <button className={styles.iconButton} onClick={() => appContext.dispatch({"type": "save"})}>
                💾 Save
            </button>}
        {selection && previewable && <button className={styles.iconButton} onClick={() => {
            appContext.preview.toggle();
        }}>
            {appContext.preview.open ? "Close preview" : "Preview"}
        </button>}
        <PopupMenu menuRef={menuRef} />
    </div>;
}
