import React, { MutableRefObject, useContext, useRef, } from "react";
import { Button, Input, Label } from "reactstrap";
import { InputType } from "reactstrap/lib/Input";

import {
    ChemicalFormula,
    Choice,
    Formula,
    FreeTextRule,
    GraphChoice, ParsonsChoice,
    Quantity, RegexPattern,
    StringChoice
} from "../../../isaac-data-types";
import { TrustedHtml } from "../../../isaac/TrustedHtml";

import {
    BaseValuePresenter, buildValuePresenter, ValuePresenter, ValuePresenterProps,
    ValuePresenterRef,
    ValueWrapper
} from "./BaseValuePresenter";
import { SemanticDocProp } from "../props/SemanticDocProp";
import { CheckboxDocProp } from "../props/CheckboxDocProp";
import { EditableValueProp } from "../props/EditableDocProp";
import { CHOICE_TYPES } from "../ChoiceInserter";
import { PresenterProps } from "../registry";
import { ListPresenterProp } from "../props/listProps";
import { ItemsContext } from "./ItemQuestionPresenter";

import styles from "../styles/choice.module.css";


interface LabeledInputProps<V extends Record<string, string | undefined>> {
    value: MutableRefObject<V | undefined>;
    prop: keyof V;
    label: string;
    className?: string;
    type?: InputType;
}

function LabeledInput<V extends Record<string, string | undefined>>({value, prop, label, className, type}: LabeledInputProps<V>) {
    return <Label className={className}>
        {label}
        <Input type={type ?? "text"}
               // eslint-disable-next-line jsx-a11y/no-autofocus
               autoFocus
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
            if (doc.value === undefined || doc.value === "") {
                return <div><em>Enter value and python expression here</em></div>;
            } else {
                return <div><TrustedHtml html={doc.value} /><pre>PYTHON: {doc.pythonExpression}</pre></div>
            }
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

const FormulaPresenter = (props: ValuePresenterProps<Formula>) => {
    const {valueRef, ...rest} = props;
    return <>
        <FormulaPresenterInner {...props}/>
        <CheckboxDocProp {...rest} prop="requiresExactMatch" label="Require exact match"/>
    </>;
};

export const ChemicalFormulaPresenter = buildValuePresenter(
    function ChemicalFormulaValue({editing, doc, value}) {
        if (!editing) {
            if (doc.mhchemExpression === undefined || doc.mhchemExpression === "") {
                return <div><em>Enter mhchem formula here</em></div>;
            } else {
                return <TrustedHtml html={`$\\ce{${doc.mhchemExpression}}$`} />;
            }
        } else {
            return <>
                <LabeledInput value={value} prop="mhchemExpression" label="mhchem formula" className={styles.fullWidth} />
            </>;
        }
    },
    (doc: ChemicalFormula) => ({mhchemExpression: doc.mhchemExpression}),
    ({mhchemExpression}, doc) => ({...doc, mhchemExpression}),
);

export const StringChoicePresenter = (props: ValuePresenterProps<StringChoice>) => {
    const {valueRef, ...rest} = props;

    return <>
        <EditableValueProp {...rest} placeHolder="Enter choice here" ref={valueRef} />
        <br />
        <br />
        <CheckboxDocProp {...rest} prop="caseInsensitive" label="Case insensitive" />
    </>;
};

export const FreeTextRulePresenter = (props: ValuePresenterProps<FreeTextRule>) => {
    const {valueRef, ...rest} = props;

    return <>
        <EditableValueProp {...rest} placeHolder="Matching rule" ref={valueRef} />
        <br />
        <br />
        <CheckboxDocProp {...rest} prop="caseInsensitive" label="Case insensitive" />
        <CheckboxDocProp {...rest} prop="allowsAnyOrder" label="Any order" />
        <CheckboxDocProp {...rest} prop="allowsExtraWords" label="Extra words" />
        <CheckboxDocProp {...rest} prop="allowsMisspelling" label="Misspelling" />
    </>;
};

export const RegexPatternPresenter = (props: ValuePresenterProps<RegexPattern>) => {
    const {valueRef, ...rest} = props;

    function regexHelper() {
        let regex = props.doc.value ?? "";
        if (props.doc.matchWholeString) {
            // Add caret and dollar sign if the whole string should be matched
            regex = "^" + regex + "$"
        }
        const flags = "g" + (props.doc.multiLineRegex ? "m" : "") + (props.doc.caseInsensitive ? "i" : "")
        window.open(`https://regex101.com/?regex=${encodeURIComponent(regex)}&flags=${flags}&delimiter=@&flavor=java`)
    }

    return <>
        <EditableValueProp {...rest} placeHolder="Matching rule" ref={valueRef} />
        <br />
        <CheckboxDocProp {...rest} prop="matchWholeString" label="Entire answer has to match this pattern exactly" />
        <br />
        <CheckboxDocProp {...rest} prop="caseInsensitive" label="Case insensitive" />
        <CheckboxDocProp {...rest} prop="multiLineRegex" label="Multi-line regular expression" />
        <br />
        <Button onClick={regexHelper}>Test Regex</Button>
    </>;
};

export const GraphChoicePresenter = buildValuePresenter(
    function GraphChoiceValue({editing, doc, value}) {
        if (!editing) {
            if (doc.graphSpec === undefined || doc.graphSpec === "") {
                return <em>Enter graph spec here</em>;
            }

            return <pre>{doc.graphSpec}</pre>;
        } else {
            return <LabeledInput value={value} prop="graphSpec" label="Graph spec" type="textarea" className={styles.graphSpec} />;
        }
    },
    (doc: GraphChoice) => ({graphSpec: doc.graphSpec}),
    ({graphSpec}, doc) => ({...doc, graphSpec}),
);

export const ItemChoicePresenter = (props: ValuePresenterProps<ParsonsChoice>) => {
    const {doc} = props;

    const {items} = useContext(ItemsContext) ?? [];
    const remainingItems = items?.filter(item => !doc.items?.find(i => i.id === item.id));

    return <>
        {doc.type === "itemChoice" && <CheckboxDocProp {...props} prop="allowSubsetMatch" label="Can match if a subset of the answer" />}
        <ItemsContext.Provider value={{items, remainingItems}}>
            <ListPresenterProp {...props} prop="items" childTypeOverride="item$choice" />
        </ItemsContext.Provider>
    </>;
}

const CHOICE_REGISTRY: Record<CHOICE_TYPES, ValuePresenter<Choice>> = {
    choice: BaseValuePresenter,
    quantity: QuantityPresenter,
    formula: FormulaPresenter,
    chemicalFormula: ChemicalFormulaPresenter,
    stringChoice: StringChoicePresenter,
    freeTextRule: FreeTextRulePresenter,
    logicFormula: FormulaPresenter,
    graphChoice: GraphChoicePresenter,
    regexPattern: RegexPatternPresenter,
    itemChoice: ItemChoicePresenter,
    parsonsChoice: ItemChoicePresenter,
};

export function ChoicePresenter(props: PresenterProps<Choice>) {
    const choiceValueRef = useRef<ValuePresenterRef>(null);

    const choice = props.doc;
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
            <ChoiceValuePresenter {...props} valueRef={choiceValueRef}/>
        </ValueWrapper>
        <div className={styles.choiceExplanation}>
            <SemanticDocProp {...props} prop="explanation" name="Explanation"/>
        </div>
    </div>;
}
