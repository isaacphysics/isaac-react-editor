import React, {RefObject, useCallback, useMemo, useRef, useState} from "react";
import {Popup, PopupCloseContext, PopupRef} from "./Popup";
import {Alert, Button, Col, Container, Input, InputGroup, Label, Row} from "reactstrap";
import {ChangeDesc, ChangeSet, ReactCodeMirrorRef, TransactionSpec} from "@uiw/react-codemirror";
import styles from "../../styles/editor.module.css";
import useSWR from "swr";
import {GlossaryTerm} from "../../isaac-data-types";
import {liveFetcher} from "../../services/isaacApi";
import Select from "react-select";
import {Item} from "../../utils/select";
import {isDefined} from "../../utils/types";

export const PopupGlossaryTermSelect = ({codemirror}: { codemirror: RefObject<ReactCodeMirrorRef> }) => {
    const popupRef = useRef<PopupRef>(null);

    const {data: glossaryTerms} = useSWR<{results: GlossaryTerm[]}>(
        "glossary/terms?limit=10000",
        liveFetcher,
        {
            //dedupingInterval: 600000, // Ten minutes
            revalidateOnFocus: false,
            revalidateOnMount: false
        }
    );

    const glossaryTermOptions: Item<string>[] = useMemo(() =>
        glossaryTerms?.results.filter(gt => isDefined(gt.id)).map(gt => ({value: gt.id as string, label: gt.value ?? gt.id as string})) ?? []
    , [glossaryTerms]);

    const [glossaryTermText, setGlossaryTermText] = useState<string>();
    const [glossaryTermID, setGlossaryTermID] = useState<string | undefined>();
    const [isInlineTerm, setIsInlineTerm] = useState<boolean>(true);

    const generateAndInsertGlossaryTerm = useCallback(() => {
        if (glossaryTermID) {
            const trimmedGlossaryTermText = glossaryTermText?.trim();
            codemirror.current?.view?.dispatch({
                changes: {
                    from: codemirror.current?.view?.state?.selection.main.head,
                    insert: `[glossary${isInlineTerm ? "-inline" : ""}:${glossaryTermID}${isInlineTerm && trimmedGlossaryTermText ? ` "${trimmedGlossaryTermText}"` : ""}]`
                }
            } as TransactionSpec);
        }
    }, [glossaryTermText, glossaryTermID, isInlineTerm]);

    return <>
        <button className={styles.cmPanelButton} title={"Insert glossary term"} onClick={(event) => {
            popupRef.current?.open(event);
        }}>Glossary term</button>
        <Popup popUpRef={popupRef}>
            <Container className={styles.glossaryTermGenerator}>
                <Label for={"glossary-term-id-select"}>Select glossary term:</Label>
                <Select inputId="glossary-term-id-select"
                        onChange={e => setGlossaryTermID(e?.value)}
                        options={glossaryTermOptions}
                        placeholder={"Please select a term"} />
                <hr/>
                <InputGroup className={"pl-4"}>
                    <Label for={"glossary-term-full-or-inline"}>Inline glossary term?</Label>
                    <Input type={"checkbox"} id="glossary-term-full-or-inline" placeholder={"None"} onChange={e => setIsInlineTerm(e.target.checked)} checked={isInlineTerm}/>
                </InputGroup>
                {isInlineTerm ?
                    <>
                        <Label for={"term-text-input"}>Text to display:</Label>
                        <Input id={"term-text-input"} onChange={(e) => setGlossaryTermText(e.target.value)} />
                    </>
                    :
                    <Alert color={"warning"}>
                        Please note: non-inline glossary terms can <b>only</b> be placed at the beginning of a line.
                    </Alert>
                }
                <hr/>
                <PopupCloseContext.Consumer>
                    {close => <Button disabled={!glossaryTermID} onClick={() => {
                        generateAndInsertGlossaryTerm();
                        close?.();
                    }}>
                        Generate markup
                    </Button>}
                </PopupCloseContext.Consumer>
            </Container>
        </Popup>
    </>
}