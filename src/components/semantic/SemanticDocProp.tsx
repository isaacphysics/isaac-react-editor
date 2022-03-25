import React from "react";

import { Content, ContentBase } from "../../isaac-data-types";

import { SemanticItem, SemanticItemProps } from "./SemanticItem";

type SemanticDocProps<K extends string> =
    & SemanticItemProps
    & {doc: {[k in K]?: ContentBase | undefined}}
    & { prop: K };


export const SemanticDocProp = <K extends string>({doc, update, prop, ...rest}: SemanticDocProps<K>) => {
    const subDoc = doc[prop] as Content;
    return <SemanticItem doc={subDoc} update={(newContent) => {
        update({
            ...doc,
            [prop]: newContent,
        });
    }} {...rest} />
};
