import React, { useState } from "react";
import { Button } from "reactstrap";

import { Content } from "../../isaac-data-types";
import { Box, PresenterProps, SemanticItem } from "./SemanticItem";
import styles from "./styles.module.css";

interface InserterProps {
    insert: (newContent: Content) => void;
    forceOpen: boolean;
    position: number;
}

export const emptyContent = {type: "content", encoding: "markdown", value: ""};

function InsertButton(props: { onClick: () => void }) {
    return <div className={styles.inserterAdd}>
        <Button color="link" size="lg" onClick={props.onClick}>➕</Button>
    </div>;
}

function Inserter({insert, forceOpen}: InserterProps) {
    const [isInserting, setInserting] = useState(false);

    const isOpen = forceOpen || isInserting;
    return <div className={`${styles.inserter} ${isOpen ? styles.selector : ""}`}>
        {!isOpen && <InsertButton onClick={() => setInserting(true)}/>}
        {isOpen && <Box name="?" onDelete={forceOpen ? undefined : () => setInserting(false)}>
            <p>Please choose a block type:</p>
            <Button color="link" onClick={() => {
                insert({...emptyContent});
                setInserting(false);
            }}>Content</Button>
        </Box>}
    </div>;
}

export const emptyChoice = {
    type: "choice",
    encoding: "markdown",
    value: "",
    explanation: {
        type: "content",
        children: [],
    },
    correct: false
};

function ChoiceInserter({insert, position}: InserterProps) {
    return <div className={styles.inserter}>
        <InsertButton onClick={() => insert({...emptyChoice, correct: position === 0} as Content)} />
    </div>;
}

export function deriveNewDoc(doc: Content) {
    return {
        ...doc,
        children: doc.children ? [...doc.children] : [],
    };
}

function selectInserter(doc: Content) {
    switch (doc.type) {
        case "choices":
            return ChoiceInserter;
        default:
            return Inserter;
    }
}

export function ListChildrenPresenter({doc, update}: PresenterProps) {
    const result: JSX.Element[] = [];

    function addInserter(position: number, forceOpen: boolean) {
        const UseInserter = selectInserter(doc);
        result.push(<UseInserter key={`__insert_${position}`} position={position} forceOpen={forceOpen} insert={(newContent) => {
            const newDoc = deriveNewDoc(doc);
            newDoc.children.splice(position, 0, newContent);
            update(newDoc);
        }} />);
    }

    doc.children?.forEach((child, index) => {
        addInserter(index, false);
        result.push(<SemanticItem key={child.id || `_child_${index}`} doc={child as Content} update={(newContent) => {
            const newDoc = deriveNewDoc(doc);
            newDoc.children[index] = newContent;
            update(newDoc);
        }} onDelete={() => {
            const newDoc = deriveNewDoc(doc);
            newDoc.children.splice(index, 1);
            update(newDoc);
        }}/>);
    });
    addInserter(doc.children?.length || 0, doc.children?.length === 0);
    return <>
        {result}
    </>;
}
