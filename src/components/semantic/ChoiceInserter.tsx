import React, { FunctionComponent } from "react";

import { Choice, Content } from "../../isaac-data-types";

import { InsertButton, InserterProps } from "./ListChildrenPresenter";

export function ChoiceInserter<T extends Choice>(empty: T) {
    // noinspection UnnecessaryLocalVariableJS
    const ChoiceInserter = ({insert, position}: InserterProps) =>
        <InsertButton onClick={() => insert({...empty, correct: position === 0} as Content)}/>;
    return ChoiceInserter;
}

const emptyChoice = {
    encoding: "markdown",
    value: "",
    explanation: {
        type: "content",
        children: [],
    },
};

export type CHOICE_TYPES =
    | "choice"
    | "quantity"
    | "formula"
    | "chemicalFormula"
    | "stringChoice"
    | "freeTextRule"
    | "logicFormula"
    | "graphChoice"
    ;

const emptyChoices = [
    {...emptyChoice, type: "choice"},
    {...emptyChoice, type: "quantity", units: ""},
    {...emptyChoice, type: "formula", pythonExpression: "", requiresExactMatch: false},
    {...emptyChoice, type: "chemicalFormula", mhchemExpression: ""},
    {...emptyChoice, type: "stringChoice", caseInsensitive: false},
    {...emptyChoice, type: "freeTextRule", caseInsensitive: true, allowsExtraWords: true},
    {...emptyChoice, type: "logicFormula", pythonExpression: "", requiresExactMatch: false},
    {...emptyChoice, type: "graphChoice", graphSpec: ""},
];

export const CHOICE_INSERTER_MAP: Record<string, FunctionComponent<InserterProps>> = Object.fromEntries(emptyChoices.map((choice) => {
    return [`choices$${choice.type}`, ChoiceInserter(choice)];
}));
