import React from "react";
import { Label } from "reactstrap";

import { GlossaryTerm } from "../../../isaac-data-types";

import { PresenterProps } from "../registry";
import styles from "../styles/glossaryTerm.module.css"
import { SemanticDocProp } from "../props/SemanticDocProp";
import { EditableIDProp, EditableValueProp } from "../props/EditableDocProp";
import { TagsPresenter } from "./TagsPresenter";
import { StagePresenter } from "./StagePresenter";
import { isPhy } from "../../../services/site";

export function GlossaryTermPresenter(props: PresenterProps<GlossaryTerm>) {
    return <div className={styles.wrapper}>
        <div className={styles.controls}>
            <EditableValueProp {...props} placeHolder="Glossary term" block />
            <EditableIDProp {...props} label="Term ID" block />
            <Label>Tags</Label> <TagsPresenter {...props} />
            {isPhy && <Label>Stage</Label>} 
            {isPhy && <StagePresenter {...props} />}
        </div>
        <div className={styles.explanation}>
            <SemanticDocProp {...props} prop="explanation" />
        </div>
    </div>;
}
