/* eslint-disable react/prop-types */
import React, {
    forwardRef,
    MutableRefObject,
    useRef,
} from "react";
import { Button, Input, Label } from "reactstrap";

import { PresenterProps } from "./SemanticItem";
import { Choice, Formula, Quantity } from "../../isaac-data-types";
import styles from "./choice.module.css";
import {
    BaseValuePresenter, buildValuePresenter,
    ValuePresenter,
    ValuePresenterRef,
    ValueWrapper
} from "./BaseValuePresenter";
import { SemanticDocProp } from "./SemanticDocProp";
import { CHOICE_TYPES } from "./ListChildrenPresenter";
import { CheckboxDocProp } from "./CheckboxDocProp";
import { TrustedHtml } from "../../isaac/TrustedHtml";


interface LabeledInputProps<V extends Record<string, string | undefined>> {
    value: MutableRefObject<V | undefined>;
    prop: keyof V;
    label: string;
    className?: string;
}

function LabeledInput<V extends Record<string, string | undefined>>({value, prop, label, className}: LabeledInputProps<V>) {
    return <Label className={className}>
        {label}
        <Input type="text"
               defaultValue={value.current?.[prop]}
               onChange={(e) => {
                   if (value.current !== undefined) {
                       value.current[prop] = e.target.value as V[keyof V];
                   }
               }}
        />
    </Label>;
}

export const QuantityPresenter = buildValuePresenter(
    function QuantityValue({editing, doc, value}) {
        if (!editing) {
            if (doc.value === undefined || doc.value === "") {
                return <em>Enter value and units here</em>;
            }

            const html = "$\\quantity{" + (doc.value || "") + "}{" + (doc.units || "") + "}$";
            return <TrustedHtml html={html} />;
        } else {
            return <>
                <LabeledInput value={value} prop="value" label="Quantity" />
                <LabeledInput value={value} prop="units" label="Units" />
            </>;
        }
    },
    (doc: Quantity) => ({value: doc.value, units: doc.units}),
    ({value, units}, doc) => ({...doc, value, units}),
);

export const FormulaPresenterInner = buildValuePresenter(
    function FormulaValue({editing, doc, value}) {
        if (!editing) {
            let content;
            if (doc.value === undefined || doc.value === "") {
                content = <div><em>Enter value and python expression here</em></div>;
            } else {
                content = <div><TrustedHtml html={doc.value} /><pre>PYTHON: {doc.pythonExpression}</pre></div>
            }
            return content;
        } else {
            return <>
                <LabeledInput value={value} prop="value" label="LaTeX formula" className={styles.fullWidth} />
                <LabeledInput value={value} prop="pythonExpression" label="Python expression" className={styles.fullWidth} />
            </>;
        }
    },
    (doc: Formula) => ({value: doc.value, pythonExpression: doc.pythonExpression}),
    ({value, pythonExpression}, doc) => ({...doc, value, pythonExpression}),
);

const FormulaPresenter = forwardRef<ValuePresenterRef, PresenterProps<Formula>>(({doc, update}, ref) => <>
    <FormulaPresenterInner doc={doc} update={update} ref={ref}/>
    <CheckboxDocProp doc={doc} update={update} prop="requiresExactMatch"
                     label="Require exact match"/>
</>);
FormulaPresenter.displayName = "FormulaPresenter";

const CHOICE_REGISTRY: Record<CHOICE_TYPES, ValuePresenter<Choice>> = {
    choice: BaseValuePresenter,
    quantity: QuantityPresenter,
    formula: FormulaPresenter,
}

export function ChoicePresenter(props: PresenterProps) {
    const choiceValueRef = useRef<ValuePresenterRef>(null);

    const choice = props.doc as Choice;
    const ChoiceValuePresenter = CHOICE_REGISTRY[choice.type as CHOICE_TYPES] ?? BaseValuePresenter;
    return <div className={styles.choice}>
        <Button onClick={() => {
            props.update({
                ...choice,
                correct: !choice.correct,
            });
        }} color={choice.correct ? "success" : "danger"}>
            {choice.correct ? "✓" : "✗"}
        </Button>
        <ValueWrapper className={styles.choiceValue} valueRef={choiceValueRef}>
            <ChoiceValuePresenter {...props} ref={choiceValueRef}/>
        </ValueWrapper>
        <div className={styles.choiceExplanation}>
            <SemanticDocProp {...props} prop="explanation" name="Explanation"/>
        </div>
    </div>;
}
