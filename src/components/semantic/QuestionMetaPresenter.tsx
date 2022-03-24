import React from "react";

import { PresenterProps } from "./SemanticItem";
import { EditableDocProp } from "./EditableDocProp";

export function QuestionMetaPresenter(props: PresenterProps) {
    return <div>
        <h2><EditableDocProp {...props} prop="title" placeHolder="Question title" /></h2>
        <h3><EditableDocProp {...props} prop="subtitle" placeHolder="Question subtitle" hideWhenEmpty /></h3>
        <h6><EditableDocProp {...props} prop="id" label="Question ID" /></h6>
    </div>;
}
