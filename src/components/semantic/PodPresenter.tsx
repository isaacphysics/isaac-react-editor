import React from "react";

import { IsaacPod } from "../../isaac-data-types";

import { PresenterProps } from "./registry";
import { EditableDocPropFor, EditableTitleProp, EditableValueProp } from "./EditableDocProp";
import { SemanticDocProp } from "./SemanticDocProp";

const EditableUrlProp = EditableDocPropFor<IsaacPod>("url");

export function PodPresenter(props: PresenterProps<IsaacPod>) {
    return <>
        <h2><EditableTitleProp {...props} label="Title" /></h2>
        <EditableValueProp {...props} label="Pod text" block />
        <EditableUrlProp {...props} label="Url" placeHolder="Pod link Url" block />
        <SemanticDocProp {...props} prop="image" />
    </>;
}
