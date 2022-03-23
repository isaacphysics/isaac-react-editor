import React from "react";

import { PresenterProps } from "./SemanticItem";
import { EditableDocProp } from "./EditableDocProp";

export function QuestionMetaPresenter(props: PresenterProps) {
    return <div>
        <h3><EditableDocProp {...props} prop="title" placeHolder="Question title" /></h3>
    </div>;
}
