import React from "react";

import { IsaacQuestionBase } from "../../../isaac-data-types";

import { CHOICE_TYPES } from "../ChoiceInserter";
import { PresenterProps } from "../registry";
import { ListPresenterProp } from "../props/listProps";
import { QUESTION_TYPES } from "./questionPresenters";

const choicesType: Record<QUESTION_TYPES, CHOICE_TYPES | null> = {
    isaacQuestion: null,
    isaacMultiChoiceQuestion: "choice",
    isaacNumericQuestion: "quantity",
    isaacSymbolicQuestion: "formula",
    isaacSymbolicChemistryQuestion: "chemicalFormula",
    isaacStringMatchQuestion: "stringChoice",
    isaacFreeTextQuestion: "freeTextRule",
    isaacSymbolicLogicQuestion: "logicFormula",
    isaacGraphSketcherQuestion: "graphChoice",
    isaacRegexMatchQuestion: "regexPattern",
    isaacItemQuestion: "itemChoice",
    isaacParsonsQuestion: "parsonsChoice",
};

export function ChoicesPresenter(props: PresenterProps<IsaacQuestionBase>) {
    const choiceType = choicesType[props.doc.type as QUESTION_TYPES];
    if (choiceType === null) {
        return null;
    }
    return <ListPresenterProp {...props}
                              prop="choices"
                              childTypeOverride={choiceType}
    />;
}
