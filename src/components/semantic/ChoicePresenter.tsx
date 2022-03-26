import React from "react";
import { Button } from "reactstrap";

import { Presenter, PresenterProps } from "./SemanticItem";
import { Choice, Formula, Quantity } from "../../isaac-data-types";
import styles from "./question.module.css";
import { ValuePresenter } from "./ValuePresenter";
import { SemanticDocProp } from "./SemanticDocProp";
import { CHOICE_TYPES } from "./ListChildrenPresenter";
import { CheckboxDocProp } from "./CheckboxDocProp";

function QuantityPresenter({doc}: PresenterProps<Quantity>) {
    if (doc.value === undefined || doc.value === "") {
        return <em>Enter value and units here</em>;
    }

    const html = "$\\quantity{" + (doc.value || "") + "}{" + (doc.units || "") + "}$";
    return <span dangerouslySetInnerHTML={{__html: html}} />;
}

function FormulaPresenter({doc, update}: PresenterProps<Formula>) {
    let content;
    if (doc.value === undefined || doc.value === "") {
        content = <div><em>Enter value and python expression here</em></div>;
    } else {
        content = <div>{doc.value}<pre>PYTHON: {doc.pythonExpression}</pre></div>
    }
    // Render checkbox
    return <>
        {content}
        <CheckboxDocProp doc={doc} update={update} prop="requiresExactMatch" label="Require exact match" />
    </>;
}

const CHOICE_REGISTRY: Record<CHOICE_TYPES, Presenter<Choice>> = {
    choice: ValuePresenter,
    quantity: QuantityPresenter,
    formula: FormulaPresenter,
}

export function ChoicePresenter(props: PresenterProps) {
    const choice = props.doc as Choice;
    const ChoiceValuePresenter = CHOICE_REGISTRY[choice.type as CHOICE_TYPES] ?? ValuePresenter;
    return <div className={styles.choice}>
        <Button onClick={() => {
            props.update({
                ...choice,
                correct: !choice.correct,
            });
        }} color={choice.correct ? "success" : "danger"}>
            {choice.correct ? "✓" : "✗"}
        </Button>
        <div className={styles.choiceValue}>
            <ChoiceValuePresenter {...props} />
        </div>
        <div className={styles.choiceExplanation}>
            <SemanticDocProp {...props} prop="explanation" name="Explanation"/>
        </div>
    </div>;
}
