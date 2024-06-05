import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { RefObject, useCallback, useContext, useRef, useState } from "react";
import React from "react";
import styles from "../../styles/editor.module.css";
import { Popup, PopupCloseContext, PopupRef } from "./Popup";
import { Button, Container, Input, Label } from "reactstrap";
import { InlineQuestionContext } from "../semantic/presenters/questionPresenters";

export const PopupInlineQuestionInsert = ({wide, codemirror}: { wide?: boolean, codemirror: RefObject<ReactCodeMirrorRef> }) => {
    const popupRef = useRef<PopupRef>(null);
    const inlineContext = useContext(InlineQuestionContext);

    const [width, setWidth] = useState<number>();
    const [height, setHeight] = useState<number>();
    const [id, setID] = useState<string>();
    const [valid, setValid] = useState<boolean>(true);

    const generateAndInsertInlinePart = useCallback(() => {
        const partId = id ? id : (inlineContext.numParts ?? 0) + 1;
        const inlinePartSyntax = `[inline-question:${partId}${(width || height) ? "|" : ""}${width ? `w-${width}` : ""}${height ? `h-${height}` : ""}]`;
        codemirror.current?.view?.dispatch(
            codemirror.current?.view?.state.replaceSelection(inlinePartSyntax)
        );
        inlineContext.addPart?.("" + partId);
    }, [width, height, id, codemirror, inlineContext]);

    const ifValidNumericalInputThen = (f: (n: number | undefined) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = parseInt(e.target.value);
        if (!isNaN(n) || !e.target.value || e.target.value === "") {
            setValid(true);
            f(n);
        } else {
            setValid(false);
        }
    }

    return <>
        <button className={styles.cmPanelButton} title={"Insert inline question part"} onClick={(event) => {
            popupRef.current?.open(event);
        }}>{wide ? "Add inline question part" : "➕ inline part"}</button>
        <Popup popUpRef={popupRef}>
            <Container className={styles.cmPanelPopup}>
                <Label for={"inline-part-index"}>Part ID</Label>
                <Input id={"inline-part-index"} placeholder={"Default"} onChange={(e) => setID(e.target.value)} />
                <hr/>
                <Label for={"inline-part-width"}>Width:</Label>
                <Input id={"inline-part-width"} placeholder={"Default"} onChange={ifValidNumericalInputThen(setWidth)}/>
                <hr/>
                <Label for={"inline-part-height"}>Height:</Label>
                <Input id={"inline-part-height"} placeholder={"Default"} onChange={ifValidNumericalInputThen(setHeight)} />
                <hr/>
                <PopupCloseContext.Consumer>
                    {close => <Button disabled={!valid} onClick={() => {
                        generateAndInsertInlinePart();
                        setWidth(undefined);
                        setHeight(undefined);
                        setID(undefined);
                        close?.();
                    }}>Insert</Button>}
                </PopupCloseContext.Consumer>
            </Container>
        </Popup>
    </>
}