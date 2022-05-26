import React, {RefObject, useCallback} from "react";
import {EditorSelection, ReactCodeMirrorRef} from "@uiw/react-codemirror";
import {PopupGlossaryTermSelect} from "./popups/PopupGlossaryTermSelect";
import {PopupDropZoneInsert} from "./popups/PopupDropZoneInsert";
import styles from "../styles/editor.module.css";
import {SITE} from "../services/site";

export const CodeMirrorMenu = ({codemirror}: { codemirror: RefObject<ReactCodeMirrorRef> }) => {

    const makeBold = useCallback(() => {
        codemirror.current?.view?.dispatch(codemirror.current?.view?.state.changeByRange(range => ({
            changes: [{from: range.from, insert: "**"}, {from: range.to, insert: "**"}],
            range: EditorSelection.range(range.from + 2, range.to + 2)
        })));
    }, [codemirror]);

    const makeItalic = useCallback(() => {
        codemirror.current?.view?.dispatch(codemirror.current?.view?.state.changeByRange(range => ({
            changes: [{from: range.from, insert: "*"}, {from: range.to, insert: "*"}],
            range: EditorSelection.range(range.from + 1, range.to + 1)
        })));
    }, [codemirror]);

    const makeInlineCode = useCallback(() => {
        codemirror.current?.view?.dispatch(codemirror.current?.view?.state.changeByRange(range => ({
            changes: [{from: range.from, insert: "`"}, {from: range.to, insert: "`"}],
            range: EditorSelection.range(range.from + 1, range.to + 1)
        })));
    }, [codemirror]);

    return <div className={"d-flex w-100 bg-light border-bottom p-1 " + styles.cmMenuBar}>
        <button className={"ml-auto " + styles.cmPanelButton} onClick={makeBold}>
            <b>Bold</b>
        </button>
        <button className={styles.cmPanelButton} onClick={makeItalic}>
            <i>Italic</i>
        </button>
        <button className={styles.cmPanelButton} onClick={makeInlineCode}>
            <pre className={"d-inline"}>code</pre>
        </button>
        {SITE === "CS" && <PopupGlossaryTermSelect codemirror={codemirror} />}
        <PopupDropZoneInsert codemirror={codemirror} />
    </div>
}