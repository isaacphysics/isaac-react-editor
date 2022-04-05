import React, { MouseEvent, MutableRefObject, useCallback, useMemo } from "react";
import { Button } from "reactstrap";

import { Content } from "../../isaac-data-types";

import { SemanticItem } from "./SemanticItem";
import { Inserter } from "./Inserter";
import styles from "./styles.module.css";
import { CHOICE_INSERTER_MAP, ChoiceInserter } from "./ChoiceInserter";
import { PresenterProps } from "./registry";
import { useFixedRef } from "../../utils/hooks";
import { generate, useKeyedList, useWithIndex } from "../../utils/keyedListHook";

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

const INSERTER_MAP: Record<string, React.FunctionComponent<InserterProps>> = {
    ...CHOICE_INSERTER_MAP,
    isaacQuiz: ChoiceInserter({type: "isaacQuizSection", id: generate, encoding: "markdown", children: []})
}

interface ListChildProps {
    docRef: MutableRefObject<Content>;
    child: Content;
    index: number;
    shiftBy: (index: number, amount: number) => void;
    update: (index: number, newValue: Content) => void;
    remove: (index: number) => void;
}

function ListChild({child, docRef, index, shiftBy, update, remove}: ListChildProps) {
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
        shiftBy(index, amount);
    }, [index, shiftBy]);
    const up = index > 0;
    const down = index < (docRef.current.children?.length ?? 0) - 1;
    const shift = useMemo(() => ({
        up,
        down,
        by,
    }), [by, down, up]);
    const doUpdate = useWithIndex(update, index);
    const doRemove = useWithIndex(remove, index);
    return <SemanticItem doc={child} update={doUpdate} onDelete={doRemove} shift={shift}/>;
}

export function deriveNewDoc(doc: MutableRefObject<Content>) {
    return {
        ...doc.current,
        children: doc.current.children ? [...doc.current.children] : [],
    };
}

export function ListChildrenPresenter({doc, update}: PresenterProps) {
    const docRef = useFixedRef(doc);

    const deriveNewList: () => [Content, Content[]] = useCallback(() => {
        const newDoc = deriveNewDoc(docRef);
        return [newDoc, newDoc.children];
    }, [docRef]);
    const {insert, keyList, ...rest} = useKeyedList(doc?.children, deriveNewList, update);

    const result: JSX.Element[] = [];

    function addInserter(index: number, forceOpen: boolean) {
        const UseInserter = INSERTER_MAP[`${doc.type}$${doc.layout}`] || INSERTER_MAP[`${doc.type}`] || Inserter;
        // There is no optimal solution here: we want to keep inserter state between boxes, but if a box is deleted,
        // there is no general solution for keeping an inserter open neighbouring the deleted box.
        const key = `__insert_${keyList[index] ?? "last"}`;
        result.push(<UseInserter key={key} position={index} forceOpen={forceOpen} insert={insert} />);
    }

    doc.children?.forEach((child, index) => {
        addInserter(index, false);
        result.push(<ListChild key={keyList[index]}
                               child={child as Content}
                               docRef={docRef}
                               index={index}
                               {...rest}
        />);
    });
    addInserter(doc.children?.length || 0, doc.children?.length === 0);
    return <>
        {result}
    </>;
}
