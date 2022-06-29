import React, {RefObject, useContext} from "react";
import {ReactCodeMirrorRef} from "@uiw/react-codemirror";
import {PopupGlossaryTermSelect} from "./popups/PopupGlossaryTermSelect";
import {PopupDropZoneInsert} from "./popups/PopupDropZoneInsert";
import styles from "../styles/editor.module.css";
import {SITE} from "../services/site";
import {
    encodingSpecific,
    isMarkupEncoding,
    makeBold,
    makeCode,
    makeItalic,
    makeStrikethrough
} from "../utils/codeMirrorExtensions";

export const MarkupToolbar = ({codemirror, encoding}: { codemirror: RefObject<ReactCodeMirrorRef>, encoding: string | undefined }) => {
    if (isMarkupEncoding(encoding)) {
        return <div className={"d-flex w-100 bg-light border-bottom p-1 " + styles.cmMenuBar}>
            <button className={"ml-auto " + styles.cmPanelButton} title={"Bold (Ctrl-B)"}
                    aria-label={"Make highlighted text bold (shortcut is Ctrl-B)"}
                    onClick={() => makeBold(encoding)(codemirror.current?.view)}>
                <b>B</b>
            </button>
            <button className={styles.cmPanelButton} title={"Italic (Ctrl-Shift-I)"}
                    aria-label={"Make highlighted text italic (shortcut is Ctrl-Shift-I)"}
                    onClick={() => makeItalic(encoding)(codemirror.current?.view)}>
                <i>I</i>
            </button>
            <button className={styles.cmPanelButton} title={"Strikethrough (Ctrl-Shift-S)"}
                    aria-label={"Strike-through highlighted text (shortcut is Ctrl-Shift-S)"}
                    onClick={() => makeStrikethrough(encoding)(codemirror.current?.view)}>
                <s className={"d-inline"}>S</s>
            </button>
            <button className={styles.cmPanelButton} title={"Code (Ctrl-Shift-C)"}
                    aria-label={"Format highlighted text as code (shortcut is Ctrl-Shift-C)"}
                    onClick={() => makeCode(encoding)(codemirror.current?.view)}>
                <pre className={"d-inline"}>&lt;&gt;</pre>
            </button>
            {encodingSpecific(
                <>
                    <PopupDropZoneInsert codemirror={codemirror}/>
                    {SITE === "CS" && <PopupGlossaryTermSelect codemirror={codemirror}/>}
                </>,
                null,
                encoding
            )}
        </div>;
    }
    return null;
}
