import React from "react";
import { Remarkable } from "remarkable";
import { linkify } from "remarkable/linkify";

import { PresenterProps } from "./SemanticItem";
import { Formula, Quantity } from "../../isaac-data-types";

const converter = new Remarkable({
    html: true,
}).use(linkify);

export function ValuePresenter({doc}: PresenterProps) {
    let value = doc.value;
    if (doc.type === "quantity") {
        const quantity = doc as Quantity;
        if (value === "") {
            return <em>Enter quantity here</em>;
        }
        value = `${doc.value} ${quantity.units}`;
    }
    if (doc.type === "formula") {
        const quantity = doc as Formula;
        if (value === "") {
            return <em>Enter formula here</em>;
        }
        value = `${doc.value}\r\n${quantity.pythonExpression}`;
    }
    if (value === "" && doc.type === "choice") {
        return <em>Enter choice here</em>;
    }
    switch (doc.encoding) {
        case "html":
            return <div dangerouslySetInnerHTML={{__html: value || ""}} />;
        case "markdown":
            return <div dangerouslySetInnerHTML={{__html: converter.render(value || "")}} />;
        case "plain":
            return <div>{value}</div>;
        default:
            return <div>{`<${doc.encoding}> ${value}`}</div>;
    }
}
