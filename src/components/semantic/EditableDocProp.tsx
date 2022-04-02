import { Content } from "../../isaac-data-types";
import { EditableText, EditableTextProps, EditableTextRef } from "./EditableText";
import React, { forwardRef } from "react";
import { KeysWithValsOfType } from "../../utils/types";
import { PresenterProps } from "./registry";

type CustomTextProps = Omit<EditableTextProps, "onSave" | "text">;
type EditableDocProps<D extends Content> =
    & PresenterProps<D>
    & CustomTextProps;

export const EditableDocPropFor = <
    D extends Content,
    K extends KeysWithValsOfType<D, string | undefined> = KeysWithValsOfType<D, string | undefined>,
>(prop: K, defaultProps?: CustomTextProps) => {
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
            {...defaultProps}
            {...rest}
            ref={ref} />
    };
    return forwardRef(typedRender);
};

export const EditableIDProp = EditableDocPropFor("id", {block: true});
export const EditableTitleProp = EditableDocPropFor("title", {latex: true, block: true});
export const EditableSubtitleProp = EditableDocPropFor("subtitle", {block: true});
export const EditableValueProp = EditableDocPropFor("value", {block: true});

export const NumberDocPropFor = <
    D extends Content,
    K extends KeysWithValsOfType<D, number | undefined> = KeysWithValsOfType<D, number | undefined>,
    >(prop: K, defaultProps?: CustomTextProps) => {
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
            {...defaultProps}
            {...rest}
            ref={ref} />
    };
    return forwardRef(typedRender);
};
