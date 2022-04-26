import React, { useCallback, useMemo } from "react";
import { Alert } from "reactstrap";

import { Content } from "../../../isaac-data-types";

import { BaseValuePresenter, ValuePresenterProps, } from "./BaseValuePresenter";
import { ListChildrenPresenter } from "./ListChildrenPresenter";

function PromotableValuePresenter({doc: baseDoc, update: baseUpdate}: ValuePresenterProps) {
    const doc = useMemo(() => ({type: "content", children: [{type: "content", encoding: baseDoc.encoding, value: baseDoc.value}]}), [baseDoc]);
    const update = useCallback((newContent: Content) => {
        if (newContent.children?.length === 1) {
            baseUpdate(newContent.children[0]);
        } else {
            baseUpdate(newContent);
        }
    }, [baseUpdate]);

    return <ListChildrenPresenter doc={doc} update={update} />;
}

export const ContentValueOrChildrenPresenter = (props: ValuePresenterProps) => {
    const {doc, topLevel} = props;
    if (doc.value && doc.children) {
        return <Alert color="warning">Error: this item contains both a value and children; please delete one.</Alert>;
    } else if (doc.children) {
        return <ListChildrenPresenter {...props} />;
    } else {
        return topLevel ? <PromotableValuePresenter {...props} /> : <BaseValuePresenter {...props} />;
    }
};
