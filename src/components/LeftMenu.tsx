import React, { useContext, useLayoutEffect, useState } from "react";

import { AppContext } from "../App";
import { FileBrowser, pathToId } from "./FileBrowser";

import styles from "../styles/editor.module.css";


function dirname(path: string | undefined) {
    if (!path) return path;
    return path.substring(0, path.lastIndexOf('/'));
}

function scrollPathIntoView(path: string) {
    const item = document.getElementById(pathToId(path));
    item?.scrollIntoView({block: "start", inline: "start", behavior: "smooth"});
    return item !== undefined;
}

export function LeftMenu() {
    const appContext = useContext(AppContext);

    const path = appContext.selection.getSelection()?.path;

    const [isOpen, setOpen] = useState(true);

    // Run this on first load only
    useLayoutEffect(() => {
        function tryAgain() {
            if (path) {
                if (!scrollPathIntoView(path)) {
                    // FIXME: stop trying if there is an error
                    if (path === appContext.selection.getSelection()?.path) {
                        setTimeout(tryAgain, 250);
                    }
                }
            }
        }
        tryAgain();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div className={`${styles.leftMenuWrapper} ${isOpen ? styles.leftMenuOpen : styles.leftMenuClosed}`}>
        <button className={styles.leftMenuOpener} onClick={() => setOpen(!isOpen)}>◀</button>
        <header className={styles.leftMenuHeader}>
            <button className={styles.iconButton} onClick={() => {
                const selection = appContext.selection.getSelection();
                const basePath = selection?.isDir ? selection?.path : dirname(selection?.path);
                if (basePath) {
                    appContext.dispatch({type: "new", path: basePath});
                }
            }}>
                New...
            </button>
            <button className={`${styles.iconButton} ${styles.sm}`} onClick={() => {
                const selection = appContext.selection.getSelection();
                if (selection) {
                    const path = selection.path;
                    scrollPathIntoView(path);
                }
            }}>🔍</button>
        </header>
        <FileBrowser/>
    </div>;
}
