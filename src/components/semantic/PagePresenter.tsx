import React from "react";

import { IsaacEventPage, IsaacQuiz, IsaacQuizSection } from "../../isaac-data-types";

import { PresenterProps } from "./registry";
import { SemanticDocProp } from "./SemanticDocProp";
import { EditableTitleProp } from "./EditableDocProp";
import { Button } from "reactstrap";

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

export function EventPagePresenter(props: PresenterProps<IsaacEventPage>) {
    const {doc} = props
    return <>
        {doc.location && <>
            <Button color="link">
                {doc.location.address?.addressLine1}, {doc.location.address?.county}
            </Button>
            <br />
        </>}
        <SemanticDocProp {...props} prop="eventThumbnail" name="Thumbnail"/>
    </>;
}
