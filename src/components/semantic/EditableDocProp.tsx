/* eslint-disable react/prop-types */
import { PresenterProps } from "./SemanticItem";
import { Content } from "../../isaac-data-types";
import { EditableText, EditableTextProps, EditableTextRef } from "./EditableText";
import React, { forwardRef } from "react";
import { KeysWithValsOfType } from "../../utils/types";

type EditableDocProps =
    & PresenterProps
    & { prop: KeysWithValsOfType<Content, string | undefined> }
    & Omit<EditableTextProps, "onSave" | "text">;

export const EditableDocProp = forwardRef<EditableTextRef, EditableDocProps>(({doc, update, prop, ...rest}, ref) => {
    return <EditableText onSave={(newText) => {
        const newDoc = {...doc};
        newDoc[prop] = newText;
        update(newDoc);
    }} text={doc[prop]} {...rest} ref={ref} />
});
EditableDocProp.displayName = "EditableDocProp";
