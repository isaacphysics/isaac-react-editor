import React, { useCallback, useRef } from "react";

import { Content, ContentBase } from "../../isaac-data-types";
import { useFixedRef } from "../../utils/hooks";

import { PresenterProps } from "./registry";
import { ListChildrenPresenter } from "./ListChildrenPresenter";

type ListPresenterPropProps<T> = PresenterProps<T> & {
    prop: keyof T;
    // FIXME: just pass type through directly rather than messing with layout
    layout?: string;
};

export function ListPresenterProp<T extends ContentBase>({doc, update, prop, layout}: ListPresenterPropProps<T>) {
    const type = `${doc.type}$${prop}`;
    const docRef = useFixedRef(doc);
    const childRef = useRef({type, layout} as Content);
    const child = childRef.current;
    child.children = doc[prop] as unknown as ContentBase[] ?? [];
    const updateChild = useCallback((newContent: Content) => {
        update({...docRef.current, [prop]: newContent.children});
    }, [docRef, prop, update]);

    return <ListChildrenPresenter doc={child} update={updateChild}/>
}
