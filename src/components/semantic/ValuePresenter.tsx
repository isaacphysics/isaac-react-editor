import React from "react";
import { Remarkable } from "remarkable";
import { linkify } from "remarkable/linkify";

import { PresenterProps } from "./SemanticItem";

const converter = new Remarkable({
    html: true,
}).use(linkify);

export function ValuePresenter({doc}: PresenterProps) {
    switch (doc.encoding) {
        case "html":
            return <div dangerouslySetInnerHTML={{__html: doc.value || ""}} />;
        case "markdown":
            return <div dangerouslySetInnerHTML={{__html: converter.render(doc.value || "")}} />;
        case "plain":
            return <div>{doc.value}</div>;
        default:
            return <div>{`<${doc.encoding}> ${doc.value}`}</div>;
    }
}
