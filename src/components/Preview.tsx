import React, { useContext, useEffect, useRef } from "react";

import { AppContext } from "../App";
import { Content } from "../isaac-data-types";

import styles from "../styles/editor.module.css";

export type PreviewMode = "modal" | "panel";

export const defaultPreview = {
    open: false,
    toggle: (() => {
        throw new Error("preview.toggle called outside AppContext");
    }) as () => void,
    mode: "modal" as PreviewMode,
    toggleMode: (() => {
        throw new Error("preview.toggleMode called outside AppContext");
    }) as () => void,
};

export function Preview() {
    const appContext = useContext(AppContext);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    let doc: Content|null = null;
    try {
        doc = appContext.editor.getCurrentDoc();
    } catch (e) {
        // No doc currently
    }

    useEffect(() => {
        setTimeout(() => {
            console.log(iframeRef.current, iframeRef.current?.contentWindow);
            iframeRef.current?.contentWindow?.postMessage({
                doc,
            }, "http://localhost:3001");
        }, 5000);
    }, [doc]);

    return <div className={styles.previewWrapper}>
        <div className={styles.previewTopMenu}>
            <button className={`${styles.iconButton} ${styles.sm}`} onClick={() => appContext.preview.toggleMode()}>{appContext.preview.mode === "modal" ? "↘" : "↖"}</button>
            <button className={`${styles.iconButton} ${styles.sm}`} onClick={() => appContext.preview.toggle()}>✖</button>
        </div>
        <iframe ref={iframeRef} className={styles.previewIframe} title="Isaac Preview" src="http://localhost:3001/" />
    </div>;
}
