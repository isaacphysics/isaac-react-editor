import React from "react";

import { IsaacQuiz, IsaacQuizSection } from "../../isaac-data-types";

import { PresenterProps } from "./registry";
import { SemanticDocProp } from "./SemanticDocProp";
import { EditableTitleProp } from "./EditableDocProp";

export function QuizPagePresenter(props: PresenterProps<IsaacQuiz>) {
    return <>
        <SemanticDocProp {...props} prop="rubric" name="Rubric" />
        <h3>Quiz Sections</h3>
    </>;
}

export function QuizSectionPresenter(props: PresenterProps<IsaacQuizSection>) {
    return <>
        <h4><EditableTitleProp {...props} label="Title" /></h4>
    </>;
}
