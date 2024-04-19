import React from "react";
import { EnumPropFor } from "../props/EnumProp";
import { PresenterProps } from "../registry";
import { Content } from "../../../isaac-data-types";

export const EditableInlineTypeProp = (props : PresenterProps<Content> & {disabled? : boolean}) => {
    const {doc, update, disabled} = props;

    return <div>
        {EnumPropFor("type", {
            isaacStringMatchQuestion: "String Match Question", 
            isaacNumericQuestion: "Numeric Question",
        })({doc: {...doc, type: doc.type === "inlineQuestionPart" ? "isaacStringMatchQuestion" : doc.type}, 
            update,
            dropdownOptions: {disabled: disabled ?? false},
        })}
    </div>;
}
