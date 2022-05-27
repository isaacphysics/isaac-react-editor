import React, {RefObject, useCallback} from "react";
import {EditorSelection, ReactCodeMirrorRef} from "@uiw/react-codemirror";
import {PopupGlossaryTermSelect} from "./popups/PopupGlossaryTermSelect";
import {PopupDropZoneInsert} from "./popups/PopupDropZoneInsert";
import styles from "../styles/editor.module.css";
import {SITE} from "../services/site";

function isMarkupEncoding(encoding: string | undefined): encoding is "markdown" | "html" {
    return encoding === "markdown" || encoding === "html";
}

export const MarkupToolbar = ({codemirror, encoding}: { codemirror: RefObject<ReactCodeMirrorRef>, encoding: string | undefined }) => {

    function encodingSpecific<T>(markdownChoice: T, htmlChoice: T, encoding: "markdown" | "html"): T {
        return {
            markdown: markdownChoice,
            html: htmlChoice,
        }[encoding];
    }

    const emphTextWith = useCallback((lemph: string, remph?: string) => () => {
        remph = remph ?? lemph;
        const lemphLength = lemph.length;
        const remphLength = remph.length;
        codemirror.current?.view?.dispatch(codemirror.current?.view?.state.changeByRange(range => {
            const text = codemirror.current?.view?.state.sliceDoc(range.from - lemphLength, range.to + remphLength);
            if (text?.slice(0, lemphLength) === lemph && text?.slice(-remphLength) === remph) {
                return {
                    changes: [
                        {from: range.from - lemphLength, to: range.from, insert: ""},
                        {from: range.to, to: range.to + remphLength, insert: ""}
                    ],
                    range: EditorSelection.range(range.from - lemphLength, range.to - lemphLength)
                };
            }
            return {
                changes: [
                    {from: range.from, insert: lemph},
                    {from: range.to, to: range.to, insert: remph}
                ],
                range: EditorSelection.range(range.from + lemphLength, range.to + lemphLength)
            };
        }));
    }, [codemirror]);

    if (isMarkupEncoding(encoding)) {
        const makeBold = emphTextWith(encodingSpecific("**", "<b>", encoding), encodingSpecific("**", "</b>", encoding));
        const makeItalic = emphTextWith(encodingSpecific("*", "<i>", encoding), encodingSpecific("*", "</i>", encoding));
        const makeStrikethrough = emphTextWith(encodingSpecific("~~", "<s>", encoding), encodingSpecific("~~", "</s>", encoding));
        const makeCode = emphTextWith(encodingSpecific("`", "<pre>", encoding), encodingSpecific("`", "</pre>", encoding));

        return <div className={"d-flex w-100 bg-light border-bottom p-1 " + styles.cmMenuBar}>
            <button className={"ml-auto " + styles.cmPanelButton} title={"Bold"} aria-label={"Make highlighted text bold"} onClick={makeBold}>
                <b>B</b>
            </button>
            <button className={styles.cmPanelButton} title={"Italic"} aria-label={"Make highlighted text italic"} onClick={makeItalic}>
                <i>I</i>
            </button>
            <button className={styles.cmPanelButton} title={"Strikethrough"} aria-label={"Strike-through highlighted text"} onClick={makeStrikethrough}>
                <s className={"d-inline"}>S</s>
            </button>
            <button className={styles.cmPanelButton} title={"Code"} aria-label={"Format highlighted text as code"} onClick={makeCode}>
                <pre className={"d-inline"}>&lt;&gt;</pre>
            </button>
            {encodingSpecific(
                <>
                    {SITE === "CS" && <PopupGlossaryTermSelect codemirror={codemirror} />}
                    <PopupDropZoneInsert codemirror={codemirror} />
                </>,
                null,
                encoding
            )}
        </div>;
    }
    return null;
}