import React from "react";
import {
    BaseValuePresenter,
    ValuePresenterProps,
} from "./BaseValuePresenter";
import { Alert } from "reactstrap";

import { ListChildrenPresenter } from "./ListChildrenPresenter";
import { Box } from "../SemanticItem";

export const ContentValueOrChildrenPresenter = (props: ValuePresenterProps) => {
    const {doc} = props;
    if (doc.value && doc.children) {
        return <Alert color="warning">Error: this item contains both a value and children; please
            delete one.</Alert>;
    } else if (doc.children) {
        return <ListChildrenPresenter {...props} />;
    } else {
        // TODO: show Inserter above and below this content and allow promotion to list
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
        // TODO: as above, show Inserter above and below this content and allow promotion to list
        return <BaseValuePresenter {...props} />;
    }
};
