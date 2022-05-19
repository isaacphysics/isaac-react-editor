import React from "react";

import { IsaacCard, IsaacCardDeck } from "../../../isaac-data-types";

import { PresenterProps } from "../registry";
import { CheckboxDocProp } from "../props/CheckboxDocProp";
import { SemanticDocProp } from "../props/SemanticDocProp";
import { EditableDocPropFor } from "../props/EditableDocProp";
import { ListPresenterProp } from "../props/listProps";

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

export function CardDeckPresenter(props: PresenterProps<IsaacCardDeck>) {
    return <ListPresenterProp {...props} prop="cards" childTypeOverride="isaacCard" />;
}
