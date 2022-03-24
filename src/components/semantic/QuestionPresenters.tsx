import React, { useMemo, useState } from "react";

import { PresenterProps, SemanticItem } from "./SemanticItem";
import { EditableDocProp } from "./EditableDocProp";
import styles from "./question.module.css";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { IsaacQuestionBase, IsaacQuickQuestion } from "../../isaac-data-types";
import { SemanticDocProp } from "./SemanticDocProp";

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
