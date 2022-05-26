import React, {RefObject, useCallback, useRef, useState} from "react";
import {Popup, PopupCloseContext, PopupRef} from "./Popup";
import {Button, Container, Input, Label} from "reactstrap";
import {ReactCodeMirrorRef} from "@uiw/react-codemirror";
import styles from "../../styles/editor.module.css";

export const PopupDropZoneInsert = ({codemirror}: { codemirror: RefObject<ReactCodeMirrorRef> }) => {
    const popupRef = useRef<PopupRef>(null);

    const [width, setWidth] = useState<number>();
    const [height, setHeight] = useState<number>();
    const [valid, setValid] = useState<boolean>(true);

    const generateAndInsertDropZone = useCallback(() => {
        codemirror.current?.view?.dispatch(
            codemirror.current?.view?.state.replaceSelection(`[drop-zone${(width || height) ? "|" : ""}${width ? `w-${width}` : ""}${height ? `h-${height}` : ""}]`)
        );
    }, [width, height, codemirror]);

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
        <button className={styles.cmPanelButton} title={"Insert cloze drop zone"} onClick={(event) => {
            popupRef.current?.open(event);
        }}>Add cloze drop zone</button>
        <Popup popUpRef={popupRef}>
            <Container className={styles.cmPanelPopup}>
                <Label for={"drop-zone-width"}>Width:</Label>
                <Input id={"drop-zone-width"} placeholder={"Default"} onChange={ifValidNumericalInputThen(setWidth)}/>
                <hr/>
                <Label for={"drop-zone-height"}>Height:</Label>
                <Input id={"drop-zone-height"} placeholder={"Default"} onChange={ifValidNumericalInputThen(setHeight)} />
                <hr/>
                <PopupCloseContext.Consumer>
                    {close => <Button disabled={!valid} onClick={() => {
                        generateAndInsertDropZone();
                        setWidth(undefined);
                        setHeight(undefined);
                        close?.();
                    }}>
                        Generate drop zone
                    </Button>}
                </PopupCloseContext.Consumer>
            </Container>
        </Popup>
    </>
}