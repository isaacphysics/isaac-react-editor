import React, { useMemo, useState } from "react";

import { PresenterProps, SemanticItem } from "./SemanticItem";
import { EditableDocProp } from "./EditableDocProp";
import styles from "./question.module.css";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input,
    Label
} from "reactstrap";
import {
    Choice,
    ChoiceQuestion,
    IsaacMultiChoiceQuestion,
    IsaacQuestionBase,
    IsaacQuickQuestion
} from "../../isaac-data-types";
import { SemanticDocProp } from "./SemanticDocProp";
import { ValuePresenter } from "./ValuePresenter";

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
                        const newDoc = {...props.doc};
                        newDoc.type = key;
                        props.update(newDoc);
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
        <h2><EditableDocProp {...props} prop="title" placeHolder="Question title"/></h2>
        <h3><EditableDocProp {...props} prop="subtitle" placeHolder="Question subtitle"
                             hideWhenEmpty/></h3>
        <h6><EditableDocProp {...props} prop="id" label="Question ID"/></h6>
    </div>;
}

export function QuickQuestionAnswerPresenter({doc, ...rest}: PresenterProps) {
    return <SemanticDocProp doc={doc as IsaacQuickQuestion} {...rest} prop="answer" name="Answer" />;
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
        const newDoc = {...question};
        newDoc.hints = newHints.children;
        update(newDoc);
    }} name="Hints" />;
}

export function ChoicesPresenter({doc, update}: PresenterProps) {
    const question = doc as ChoiceQuestion;
    const choices = useMemo(() => {
        return {
            type: "choices",
            children: question.choices,
        };
    }, [question.choices]);
    return <SemanticItem doc={choices} update={(newChoices) => {
        const newDoc = {...question};
        newDoc.choices = newChoices.children;
        update(newDoc);
    }} />;
}

export function ChoicePresenter(props: PresenterProps) {
    const choice = props.doc as Choice;
    return <div className={styles.choice}>
        <Button onClick={() => {
            const newChoice = {...choice};
            newChoice.correct = !choice.correct;
            props.update(newChoice);
        }} color={choice.correct ? "success" : "danger"}>
            {choice.correct ? "✓" : "✗"}
        </Button>
        <div className={styles.choiceValue}>
            <ValuePresenter {...props} />
        </div>
        <div className={styles.choiceExplanation}>
            <SemanticDocProp {...props} prop="explanation" name="Explanation" />
        </div>
    </div>;
}

export function MultipleChoiceQuestionPresenter(props: PresenterProps) {
    const {doc, update} = props;
    const question = doc as IsaacMultiChoiceQuestion;
    return <>
        <Label className={styles.checkboxLabel}><Input type="checkbox" checked={question.randomiseChoices} onChange={(e) => {
            const newQuestion = {...question};
            newQuestion.randomiseChoices = e.target.checked;
            update(newQuestion);
        }} />Randomise Choices</Label>
        <ChoicesPresenter {...props} />
        <HintsPresenter {...props} />
    </>;
}
