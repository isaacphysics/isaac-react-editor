import React, { useMemo, useState } from "react";

import { PresenterProps, SemanticItem } from "./SemanticItem";
import {
    EditableDocPropFor,
    EditableIDProp,
    EditableSubtitleProp,
    EditableTitleProp,
    NumberDocPropFor
} from "./EditableDocProp";
import styles from "./question.module.css";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import {
    ChoiceQuestion,
    IsaacMultiChoiceQuestion,
    IsaacNumericQuestion,
    IsaacQuestionBase,
    IsaacQuickQuestion,
    IsaacSymbolicQuestion
} from "../../isaac-data-types";
import { SemanticDocProp } from "./SemanticDocProp";
import { EditableText } from "./EditableText";
import { CheckboxDocProp } from "./CheckboxDocProp";
import { CHOICE_TYPES } from "./ListChildrenPresenter";

const QUESTION_TYPES = {
    isaacQuestion: {
        name: "Quick Question",
    },
    isaacMultiChoiceQuestion: {
        name: "Multiple Choice Question",
    },
    isaacNumericQuestion: {
        name: "Numeric Question",
    },
    isaacSymbolicQuestion: {
        name: "Symbolic Question",
    },
    isaacStringMatchQuestion: {
        name: "String Match Question",
    },
    isaacRegexMatchQuestion: {
        name: "Regex Match Question",
    },
    isaacFreeTextQuestion: {
        name: "Free Text Question",
    },
    isaacSymbolicLogicQuestion: {
        name: "Logic Question",
    },
    isaacItemQuestion: {
        name: "Item Question",
    },
    isaacParsonsQuestion: {
        name: "Parsons Question",
    },
    isaacClozeQuestion: {
        name: "Cloze (Drag and Drop) Question",
    },
    isaacSymbolicChemistryQuestion: {
        name: "Chemistry Question",
    },
    isaacGraphSketcherQuestion: {
        name: "Graph Sketcher Question",
    },
};
type QuestionType = keyof typeof QUESTION_TYPES;

function QuestionTypeSelector(props: PresenterProps) {
    const [isOpen, setOpen] = useState(false);

    const questionType = QUESTION_TYPES[props.doc.type as QuestionType];

    return <Dropdown toggle={() => setOpen(toggle => !toggle)} isOpen={isOpen}>
        <DropdownToggle caret>
            {questionType.name}
        </DropdownToggle>
        <DropdownMenu>
            {Object.keys(QUESTION_TYPES).map((key) => {
                const possibleType = QUESTION_TYPES[key as QuestionType];
                return <DropdownItem key={key} active={questionType === possibleType} onClick={() => {
                    if (questionType !== possibleType) {
                        // TODO: fixup question based on changes
                        props.update({
                            ...props.doc,
                            type: key,
                        });
                    }
                }}>
                    {possibleType.name}
                </DropdownItem>;
            })}
        </DropdownMenu>
    </Dropdown>;
}

export function QuestionMetaPresenter(props: PresenterProps) {
    return <div>
        <div className={styles.questionType}>
            <QuestionTypeSelector {...props} />
        </div>
        <h2><EditableTitleProp {...props} placeHolder="Question title"/></h2>
        <h3><EditableSubtitleProp {...props} placeHolder="Question subtitle"
                             hideWhenEmpty/></h3>
        <h6><EditableIDProp {...props} label="Question ID"/></h6>
    </div>;
}

export function AnswerPresenter({doc, ...rest}: PresenterProps) {
    return <SemanticDocProp doc={doc as IsaacQuickQuestion} {...rest} prop="answer" name="Answer" />;
}

export function QuickQuestionPresenter(props: PresenterProps) {
    const question = props.doc as IsaacQuickQuestion;
    return <>
        <QuestionMetaPresenter {...props} />
        <CheckboxDocProp doc={question} update={props.update} prop="showConfidence" label="Show confidence question" />
    </>;
}

export function HintsPresenter({doc, update}: PresenterProps) {
    const question = doc as IsaacQuestionBase;
    const hints = useMemo(() => {
        return {
            type: "content",
            layout: "tabs",
            children: question.hints,
        };
    }, [question.hints]);
    return <SemanticItem doc={hints} update={(newHints) => {
        update({
            ...question,
            hints: newHints.children,
        });
    }} name="Hints" />;
}

function getChoicesType(questionType: string): CHOICE_TYPES {
    switch (questionType) {
        case "isaacMultiChoiceQuestion": return "choice";
        case "isaacNumericQuestion": return "quantity";
        case "isaacSymbolicQuestion": return "formula";
    }
    console.log("Unknown choices type", questionType);
    return "choice";
}

export function ChoicesPresenter({doc, update}: PresenterProps) {
    const question = doc as ChoiceQuestion;
    const choices = useMemo(() => {
        return {
            type: "choices",
            // NB: We are reusing layout here for this special component to represent the type of choice
            layout: getChoicesType(question.type ?? ""),
            children: question.choices,
        };
    }, [question.type, question.choices]);
    return <SemanticItem doc={choices} update={(newChoices) => {
        update({
            ...question,
            choices: newChoices.children,
        });
    }} />;
}

export function QuestionBodyPresenter(props: PresenterProps) {
    return <>
        <ChoicesPresenter {...props} />
        <AnswerPresenter {...props} />
        <HintsPresenter {...props} />
    </>;
}

export function MultipleChoiceQuestionPresenter(props: PresenterProps) {
    const {doc, update} = props;
    const question = doc as IsaacMultiChoiceQuestion;
    return <>
        <QuestionMetaPresenter {...props} />
        <CheckboxDocProp doc={question} update={update} prop="randomiseChoices"
                         label="Randomise Choices"/>
    </>;
}

const EditableSignificantFiguresMin = NumberDocPropFor<IsaacNumericQuestion>("significantFiguresMin");
const EditableSignificantFiguresMax = NumberDocPropFor<IsaacNumericQuestion>("significantFiguresMax");
const EditableAvailableUnits = ({doc, update}: PresenterProps<IsaacNumericQuestion>) => {
    return <EditableText
        onSave={(newText) => {
            update({
                ...doc,
                availableUnits: newText?.split("|").map(unit => unit.trim()),
            });
        }}
        text={doc.availableUnits?.join(" | ")}
        label="Available units"
        />;
};
const EditableDisplayUnit = EditableDocPropFor<IsaacNumericQuestion>("displayUnit");

export function NumericQuestionPresenter(props: PresenterProps) {
    const {doc, update} = props;
    const question = doc as IsaacNumericQuestion;

    return <>
        <QuestionMetaPresenter {...props} />
        <div>
            <CheckboxDocProp doc={question} update={update} prop="disregardSignificantFigures" label="Exact answers only" />
        </div>
        {!question.disregardSignificantFigures && <div className={styles.questionLabel}>
            Significant figures
            {" "}
            <EditableSignificantFiguresMin doc={question} update={update} label="from" />
            {" "}
            <EditableSignificantFiguresMax doc={question} update={update} label="to" />
        </div>}
        <div>
            <CheckboxDocProp doc={question} update={update} prop="requireUnits" label="Require choice of units" />
        </div>
        {question.requireUnits ?
            <EditableAvailableUnits doc={question} update={update} />
        :   <EditableDisplayUnit doc={question} update={update} label="Display unit" />}
        <div className={styles.questionLabel} /> {/* For spacing */}
    </>;
}


const EditableAvailableSymbols = ({doc, update}: PresenterProps<IsaacSymbolicQuestion>) => {
    return <EditableText
        onSave={(newText) => {
            update({
                ...doc,
                availableSymbols: newText?.split(",").map(unit => unit.trim()),
            });
        }}
        text={doc.availableSymbols?.map(unit => unit.trim()).join(", ")}
        label="Available symbols"
    />;
};
const EditableFormulaSeed = EditableDocPropFor<IsaacSymbolicQuestion>("formulaSeed");

const availableMetaSymbols = [
    ["_trigs", "Trigs"],
    ["_1/trigs", "1/Trigs"],
    ["_inv_trigs", "Inv Trigs"],
    ["_inv_1/trigs", "Inv 1/Trigs"],
    ["_hyp_trigs", "Hyp Trigs"],
    ["_inv_hyp_trigs", "Inv Hyp Trigs"],
    ["_logs", "Logarithms"],
    ["_no_alphabet", "No Alphabet"]
];

function hasSymbol(availableSymbols: string[] | undefined, symbol: string) {
    return availableSymbols?.find(s => s === symbol);
}

export function SymbolicQuestionPresenter(props: PresenterProps) {
    const {doc, update} = props;
    const question = doc as IsaacSymbolicQuestion;

    function toggle(symbol: string) {
        const availableSymbols = [...question.availableSymbols ?? []];
        const index = availableSymbols.indexOf(symbol);
        if (index !== -1) {
            availableSymbols.splice(index, 1);
        } else {
            availableSymbols.push(symbol);
        }
        update({
            ...doc, availableSymbols
        });
    }

    return <>
        <QuestionMetaPresenter {...props} />
        <div className={styles.editableFullwidth}>
            <EditableAvailableSymbols doc={question} update={update} />
        </div>
        <div className={styles.symbolicMetaButtons}>
            {availableMetaSymbols.map(([symbol, label]) => {
                return <Button size="sm" key={symbol} color={hasSymbol(question.availableSymbols, symbol) ? "primary" : "secondary"} onClick={() => toggle(symbol)}>{label}</Button>
            })}
        </div>
        <div className={styles.editableFullwidth}>
            <EditableFormulaSeed doc={question} update={update} label="Formula seed" />
        </div>
    </>;
}
