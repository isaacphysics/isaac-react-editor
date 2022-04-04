import React, { MutableRefObject, useCallback, useMemo, useRef, MouseEvent } from "react";
import { Button } from "reactstrap";

import { Content } from "../../isaac-data-types";

import { SemanticItem } from "./SemanticItem";
import { Inserter } from "./Inserter";
import styles from "./styles.module.css";
import { CHOICE_INSERTER_MAP, ChoiceInserter } from "./ChoiceInserter";
import { generateGuid } from "../../utils/strings";
import { PresenterProps } from "./registry";
import { useFixedRef } from "../../utils/hooks";

export const generate = Symbol("generate id") as unknown as string;
export interface InserterProps {
    insert: (index: number, newContent: Content) => void;
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

export function deriveNewDoc(doc: MutableRefObject<Content>) {
    return {
        ...doc.current,
        children: doc.current.children ? [...doc.current.children] : [],
    };
}

const extractKey = (doc: Content, index: number) => `${doc.type}@${index}: ${Math.random()}`;

const UNINITIALISED = [] as string[];

const INSERTER_MAP: Record<string, React.FunctionComponent<InserterProps>> = {
    ...CHOICE_INSERTER_MAP,
    isaacQuiz: ChoiceInserter({type: "isaacQuizSection", id: generate, encoding: "markdown", children: []})
}

interface ListChildProps {
    docRef: MutableRefObject<Content>;
    update: (newContent: Content) => void;
    child: Content;
    index: number;
    keyList: MutableRefObject<string[]>;
}

function ListChild({child, docRef, update, index, keyList}: ListChildProps) {
    const childUpdate = useCallback((newContent: Content) => {
        const newDoc = deriveNewDoc(docRef);
        newDoc.children[index] = newContent;
        update(newDoc);
    }, [docRef, index, update]);

    const onDelete = useCallback(() => {
        const newDoc = deriveNewDoc(docRef);
        newDoc.children.splice(index, 1);
        keyList.current.splice(index, 1);
        update(newDoc);
    }, [docRef, index, keyList, update]);

    const by = useCallback((amount: number, e: MouseEvent) => {
        const elementToMove = (e.target as HTMLElement)?.parentElement?.parentElement;
        if (elementToMove) {
            const sibling = amount > 0 ? "nextElementSibling" : "previousElementSibling";
            const otherElement = elementToMove[sibling]?.[sibling] as HTMLElement|null;
            if (otherElement) {
                const otherHeight = otherElement.scrollHeight;
                const gap = 18; // 1em margin plus 1px top and bottom borders
                const shift = (otherHeight + gap) * amount;
                // Since the browser maintains scroll position in its own way, doing the scroll
                // before React has repainted leads to weird shifts when going downwards, so we'll
                // do the scroll on the rendering is done. This sadly has a slightly jerky visual
                // effect, but it works, so it'll do.
                window.requestIdleCallback(() => {
                    window.scrollBy({top: shift, behavior: "smooth"});
                });
            }
        }

        const newDoc = deriveNewDoc(docRef);
        const [d] = newDoc.children.splice(index, 1);
        const [k] = keyList.current.splice(index, 1);
        newDoc.children.splice(index + amount, 0, d);
        keyList.current.splice(index, 0, k);
        update(newDoc);
    }, [docRef, index, keyList, update]);
    const up = index > 0;
    const down = index < (docRef.current.children?.length ?? 0) - 1;
    const shift = useMemo(() => ({
        up,
        down,
        by,
    }), [by, down, up]);
    return <SemanticItem doc={child} update={childUpdate} onDelete={onDelete} shift={shift}/>;
}

export function ListChildrenPresenter({doc, update}: PresenterProps) {
    const keyList = useRef(UNINITIALISED);
    if (keyList.current === UNINITIALISED) {
        // We only want to do this pre-mount, and then we manually keep this up to date after that.
        keyList.current = doc.children?.map(extractKey) ?? [];
    }
    const result: JSX.Element[] = [];

    const docRef = useFixedRef(doc);

    const insert = useCallback((index: number, newContent: Content) => {
        if (newContent.id === generate) {
            newContent.id = generateGuid();
            if (newContent.type === "isaacQuizSection") {
                newContent.id = newContent.id?.substring(0, 8);
            }
        }
        const newDoc = deriveNewDoc(docRef);
        newDoc.children.splice(index, 0, newContent);
        keyList.current.splice(index, 0, extractKey(newContent, index));
        update(newDoc);
    }, [docRef, update]);

    function addInserter(index: number, forceOpen: boolean) {
        const UseInserter = INSERTER_MAP[`${doc.type}$${doc.layout}`] || INSERTER_MAP[`${doc.type}`] || Inserter;
        // There is no optimal solution here: we want to keep inserter state between boxes, but if a box is deleted,
        // there is no general solution for keeping an inserter open neighbouring the deleted box.
        const key = `__insert_${keyList.current[index] ?? "last"}`;
        result.push(<UseInserter key={key} position={index} forceOpen={forceOpen} insert={insert} />);
    }

    doc.children?.forEach((child, index) => {
        addInserter(index, false);
        result.push(<ListChild key={keyList.current[index]}
                               child={child as Content}
                               docRef={docRef}
                               update={update}
                               index={index}
                               keyList={keyList}
        />);
    });
    addInserter(doc.children?.length || 0, doc.children?.length === 0);
    return <>
        {result}
    </>;
}
