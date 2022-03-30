import React from "react";
import {
    BaseValuePresenter,
    ValuePresenterProps,
} from "./BaseValuePresenter";
import { Alert } from "reactstrap";

import { ListChildrenPresenter } from "./ListChildrenPresenter";
import { Box } from "./SemanticItem";

export const ContentValueOrChildrenPresenter = (props: ValuePresenterProps) => {
    const {doc} = props;
    if (doc.value && doc.children) {
        return <Alert color="warning">Error: this item contains both a value and children; please
            delete one.</Alert>;
    } else if (doc.children) {
        return <ListChildrenPresenter {...props} />;
    } else {
        return <BaseValuePresenter {...props} />;
    }
};

export const BoxedContentValueOrChildrenPresenter = (props: ValuePresenterProps) => {
    const {doc} = props;
    if (doc.value && doc.children) {
        return <Alert color="warning">Error: this item contains both a value and children; please
            delete one.</Alert>;
    } else if (doc.children) {
        return <Box>
            <ListChildrenPresenter {...props} />
        </Box>;
    } else {
        return <BaseValuePresenter {...props} />;
    }
};
