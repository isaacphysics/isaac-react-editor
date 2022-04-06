import React from "react";

import { Content, IsaacEventPage, IsaacQuiz, IsaacQuizSection } from "../../isaac-data-types";

import { PresenterProps } from "./registry";
import { SemanticDocProp } from "./SemanticDocProp";
import { EditableSubtitleProp, EditableTitleProp } from "./EditableDocProp";
import { Button } from "reactstrap";

export function PagePresenter(props: PresenterProps) {
    return <>
        <h1><EditableTitleProp {...props} placeHolder="Page title" /></h1>
        <h2><EditableSubtitleProp {...props} placeHolder="Page subtitle" hideWhenEmpty/></h2>
    </>;

}

export function QuizPagePresenter(props: PresenterProps<IsaacQuiz>) {
    return <>
        <PagePresenter {...props} />
        <SemanticDocProp {...props} prop="rubric" name="Rubric" />
        <h2>Quiz Sections</h2>
    </>;
}

export function QuizSectionPresenter(props: PresenterProps<IsaacQuizSection>) {
    return <>
        <h3><EditableTitleProp {...props} label="Title" /></h3>
    </>;
}

export function EventPagePresenter(props: PresenterProps<IsaacEventPage>) {
    const {doc} = props
    return <>
        <PagePresenter {...props} />
        {doc.location && <>
            <Button color="link">
                {doc.location.address?.addressLine1}, {doc.location.address?.county}
            </Button>
            <br />
        </>}
        <SemanticDocProp {...props} prop="eventThumbnail" name="Thumbnail"/>
    </>;
}
