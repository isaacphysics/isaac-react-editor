import { PresenterProps } from "./SemanticItem";
import { Content } from "../../isaac-data-types";
import { EditableText, EditableTextProps, EditableTextRef } from "./EditableText";
import React, { forwardRef } from "react";
import { KeysWithValsOfType } from "../../utils/types";

type EditableDocProps<D extends Content> =
    & PresenterProps<D>
    & Omit<EditableTextProps, "onSave" | "text">;

export const EditableDocPropFor = <
    D extends Content,
    K extends KeysWithValsOfType<D, string | undefined> = KeysWithValsOfType<D, string | undefined>,
>(prop: K) => {
    const typedRender = <D extends Content>({doc, update, ...rest}: EditableDocProps<D>, ref: React.ForwardedRef<EditableTextRef>) => {
        return <EditableText
            onSave={(newText) => {
                update({
                    ...doc,
                    [prop]: newText,
                });
            }}
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            text={doc[prop]}
            {...rest}
            ref={ref} />
    };
    return forwardRef(typedRender);
};

export const EditableIDProp = EditableDocPropFor("id");
export const EditableTitleProp = EditableDocPropFor("title");
export const EditableSubtitleProp = EditableDocPropFor("subtitle");
export const EditableValueProp = EditableDocPropFor("value");

export const NumberDocPropFor = <
    D extends Content,
    K extends KeysWithValsOfType<D, number | undefined> = KeysWithValsOfType<D, number | undefined>,
    >(prop: K) => {
    const typedRender = <D extends Content>({doc, update, ...rest}: EditableDocProps<D>, ref: React.ForwardedRef<EditableTextRef>) => {
        return <EditableText
            hasError={(newText) => {
                if (newText) {
                    newText = newText.trim();
                    const num = parseInt(newText, 10);
                    if (isNaN(num) || num.toString() !== newText) {
                        return "Not a number";
                    }
                }
            }}
            onSave={(newText) => {
                update({
                    ...doc,
                    [prop]: newText ? parseInt(newText, 10) : undefined,
                });
            }}
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            text={doc[prop]?.toString()}
            {...rest}
            ref={ref} />
    };
    return forwardRef(typedRender);
};
