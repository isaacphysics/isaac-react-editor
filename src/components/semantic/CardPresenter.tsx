import React, { useCallback, useRef } from "react";

import { Content, IsaacCard, IsaacCardDeck } from "../../isaac-data-types";

import { PresenterProps } from "./registry";
import { CheckboxDocProp } from "./CheckboxDocProp";
import { SemanticDocProp } from "./SemanticDocProp";
import { EditableDocPropFor } from "./EditableDocProp";
import { ListChildrenPresenter } from "./ListChildrenPresenter";
import { useFixedRef } from "../../utils/hooks";

const EditableURL = EditableDocPropFor<IsaacCard>("clickUrl");

export function CardPresenter(props: PresenterProps<IsaacCard>) {
    return <>
        <EditableURL {...props} label="URL" block />
        <div>
            <CheckboxDocProp {...props} prop="verticalContent" label="Vertical" />
            <CheckboxDocProp {...props} prop="disabled" label="Disabled" />
        </div>
        <SemanticDocProp {...props} prop="image" />
    </>;
}

export function CardDeckPresenter({doc, update}: PresenterProps<IsaacCardDeck>) {
    // Munge doc.cards into a doc.children
    // Not sure why this didn't just reuse children. This way preserves our performance.
    const docRef = useFixedRef(doc);
    const childRef = useRef({type: "cardDeckCards"} as Content);
    const child = childRef.current;
    child.children = doc.cards;
    const updateChild = useCallback((cards: Content) => {
        update({...docRef.current, cards: cards.children});
    }, [docRef, update]);
    return <ListChildrenPresenter doc={child} update={updateChild} />
}
