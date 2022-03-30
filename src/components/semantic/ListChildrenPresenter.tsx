import React, { FunctionComponent, useRef, useState } from "react";
import { Button } from "reactstrap";

import { Choice, Content } from "../../isaac-data-types";
import { Box, PresenterProps, SemanticItem } from "./SemanticItem";
import styles from "./styles.module.css";

interface InserterProps {
    insert: (newContent: Content) => void;
    forceOpen: boolean;
    position: number;
}

export const emptyContent = {type: "content", encoding: "markdown", value: ""};

function InsertButton(props: { onClick: () => void }) {
    return <div className={styles.inserter}>
        <div className={styles.inserterAdd}>
            <Button color="link" size="lg" onClick={props.onClick}>➕</Button>
        </div>
    </div>;
}

function Inserter({insert, forceOpen}: InserterProps) {
    const [isInserting, setInserting] = useState(false);

    const isOpen = forceOpen || isInserting;
    return isOpen ?
        <Box name="?" onDelete={forceOpen ? undefined : () => setInserting(false)}>
            <p>Please choose a block type:</p>
            <Button color="link" onClick={() => {
                insert({...emptyContent});
                setInserting(false);
            }}>Content</Button>
        </Box>
    :
        <InsertButton onClick={() => setInserting(true)}/>;
}

function ChoiceInserter<T extends Choice>(empty: T) {
    const ChoiceInserter = ({insert, position}: InserterProps) =>
        <InsertButton onClick={() => insert({...empty, correct: position === 0} as Content)} />;
    return ChoiceInserter;
}

const emptyChoice = {
    encoding: "markdown",
    value: "",
    explanation: {
        type: "content",
        children: [],
    },
};

export type CHOICE_TYPES =
    | "choice"
    | "quantity"
    | "formula"
    | "chemicalFormula"
    | "stringChoice"
    | "freeTextRule"
    | "logicFormula"
;

const emptyChoices = [
    {...emptyChoice, type: "choice"},
    {...emptyChoice, type: "quantity", units: ""},
    {...emptyChoice, type: "formula", pythonExpression: "", requiresExactMatch: false},
    {...emptyChoice, type: "chemicalFormula", mhchemExpression: ""},
    {...emptyChoice, type: "stringChoice", caseInsensitive: false},
    {...emptyChoice, type: "freeTextRule"},
    {...emptyChoice, type: "logicFormula", pythonExpression: "", requiresExactMatch: false},
];

const INSERTER_MAP: Partial<Record<CHOICE_TYPES, FunctionComponent<InserterProps>>> = Object.fromEntries(emptyChoices.map((choice) => {
    return [choice.type as CHOICE_TYPES, ChoiceInserter(choice)];
}));

export function deriveNewDoc(doc: Content) {
    return {
        ...doc,
        children: doc.children ? [...doc.children] : [],
    };
}

const extractKey = (doc: Content, index: number) => `${doc.type}@${index}: ${Math.random()}`;

const UNINITIALISED = [] as string[];

export function ListChildrenPresenter({doc, update}: PresenterProps) {
    const keyList = useRef(UNINITIALISED);
    if (keyList.current === UNINITIALISED) {
        // We only want to do this pre-mount, and then we manually keep this up to date after that.
        keyList.current = doc.children?.map(extractKey) ?? [];
    }
    const result: JSX.Element[] = [];

    function addInserter(index: number, forceOpen: boolean) {
        const UseInserter = (doc.type === "choices" && INSERTER_MAP[doc.layout as CHOICE_TYPES]) || Inserter;
        // There is no optimal solution here: we want to keep inserter state between boxes, but if a box is deleted,
        // there is no general solution for keeping an inserter open neighbouring the deleted box.
        const key = `__insert_${keyList.current[index] ?? "last"}`;
        result.push(<UseInserter key={key} position={index} forceOpen={forceOpen} insert={(newContent) => {
            const newDoc = deriveNewDoc(doc);
            newDoc.children.splice(index, 0, newContent);
            keyList.current.splice(index, 0, extractKey(newContent, index));
            update(newDoc);
        }} />);
    }

    doc.children?.forEach((child, index) => {
        addInserter(index, false);
        result.push(<SemanticItem key={keyList.current[index]} doc={child as Content} update={(newContent) => {
            const newDoc = deriveNewDoc(doc);
            newDoc.children[index] = newContent;
            update(newDoc);
        }} onDelete={() => {
            const newDoc = deriveNewDoc(doc);
            newDoc.children.splice(index, 1);
            keyList.current.splice(index, 1);
            update(newDoc);
        }}/>);
    });
    addInserter(doc.children?.length || 0, doc.children?.length === 0);
    return <>
        {result}
    </>;
}
