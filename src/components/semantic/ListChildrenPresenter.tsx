import React, { useRef } from "react";
import { Button } from "reactstrap";

import { Content } from "../../isaac-data-types";

import { PresenterProps, SemanticItem } from "./SemanticItem";
import { Inserter } from "./Inserter";
import styles from "./styles.module.css";
import { CHOICE_INSERTER_MAP, ChoiceInserter } from "./ChoiceInserter";
import { generateGuid } from "../../utils/strings";

export const generate = Symbol("generate id") as unknown as string;
export interface InserterProps {
    insert: (newContent: Content) => void;
    forceOpen: boolean;
    position: number;
}

export function InsertButton(props: { onClick: () => void }) {
    return <div className={styles.inserter}>
        <div className={styles.inserterAdd}>
            <Button color="link" size="lg" onClick={props.onClick}>➕</Button>
        </div>
    </div>;
}

export function deriveNewDoc(doc: Content) {
    return {
        ...doc,
        children: doc.children ? [...doc.children] : [],
    };
}

const extractKey = (doc: Content, index: number) => `${doc.type}@${index}: ${Math.random()}`;

const UNINITIALISED = [] as string[];

const INSERTER_MAP: Record<string, React.FunctionComponent<InserterProps>> = {
    ...CHOICE_INSERTER_MAP,
    isaacQuiz: ChoiceInserter({type: "isaacQuizSection", id: generate, encoding: "markdown", children: []})
}
export function ListChildrenPresenter({doc, update}: PresenterProps) {
    const keyList = useRef(UNINITIALISED);
    if (keyList.current === UNINITIALISED) {
        // We only want to do this pre-mount, and then we manually keep this up to date after that.
        keyList.current = doc.children?.map(extractKey) ?? [];
    }
    const result: JSX.Element[] = [];

    function addInserter(index: number, forceOpen: boolean) {
        const UseInserter = INSERTER_MAP[`${doc.type}$${doc.layout}`] || INSERTER_MAP[`${doc.type}`] || Inserter;
        // There is no optimal solution here: we want to keep inserter state between boxes, but if a box is deleted,
        // there is no general solution for keeping an inserter open neighbouring the deleted box.
        const key = `__insert_${keyList.current[index] ?? "last"}`;
        result.push(<UseInserter key={key} position={index} forceOpen={forceOpen} insert={(newContent) => {
            if (newContent.id === generate) {
                newContent.id = generateGuid();
                if (newContent.type === "isaacQuizSection") {
                    newContent.id = newContent.id?.substring(0, 8);
                }
            }
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
