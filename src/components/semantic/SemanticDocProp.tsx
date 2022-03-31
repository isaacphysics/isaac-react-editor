import React, { useCallback } from "react";

import { Content, ContentBase } from "../../isaac-data-types";

import { SemanticItem, SemanticItemProps } from "./SemanticItem";
import { useFixedRef } from "../../utils/hooks";

type SemanticDocProps<K extends string> =
    & SemanticItemProps
    & {doc: {[k in K]?: ContentBase | undefined}}
    & { prop: K };


export const SemanticDocProp = <K extends string>({doc, update, prop, ...rest}: SemanticDocProps<K>) => {
    const subDoc = doc[prop] as Content;
    const docRef = useFixedRef(doc);
    const childUpdate = useCallback((newContent: Content) => {
        update({
            ...docRef.current,
            [prop]: newContent,
        });
    }, [docRef, update, prop]);
    return <SemanticItem doc={subDoc} update={childUpdate} {...rest} />
};
