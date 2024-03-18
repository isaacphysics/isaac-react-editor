import React from "react";
import { EnumPropFor } from "../props/EnumProp";
import { PresenterProps } from "../registry";
import { Content } from "../../../isaac-data-types";
import { changeQuestionType, QUESTION_TYPES } from "./questionPresenters";

export const EditableInlineTypeProp = (props : PresenterProps<Content> & {disabled? : boolean}) => {
    const {doc, update, disabled} = props;

    const newUpdate : typeof update = (doc) => {
        update(doc)
        changeQuestionType({doc, update, newType: doc.type as QUESTION_TYPES});
    };

    return <div>
        {EnumPropFor("type", {
            isaacStringMatchQuestion: "String Match Question", 
            isaacNumericQuestion: "Numeric Question",
        })({doc: {...doc, type: doc.type === "inlineQuestionPart" ? "isaacStringMatchQuestion" : doc.type}, 
            update: newUpdate,
            dropdownOptions: {disabled: disabled ?? false},
        })}
    </div>;
}
