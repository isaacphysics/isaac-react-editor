import React, { FunctionComponent, useRef, useState } from "react";

import styles from "./styles.module.css";

import {
    ValuePresenter,
    ValuePresenterRef,
    ValueRef,
    ValueWrapper
} from "./BaseValuePresenter";
import { Content } from "../../isaac-data-types";
import { CHOICE_TYPES } from "./ListChildrenPresenter";
import { AccordionPresenter } from "./AccordionPresenter";
import {
    AnswerPresenter,
    ChemistryQuestionPresenter,
    FreeTextQuestionInstructions,
    MultipleChoiceQuestionPresenter,
    NumericQuestionPresenter,
    QUESTION_TYPES,
    QuestionBodyPresenter,
    QuickQuestionPresenter,
    StringMatchQuestionPresenter,
    SymbolicQuestionPresenter
} from "./QuestionPresenters";
import { TabsPresenter } from "./TabsPresenter";
import { ChoicePresenter } from "./ChoicePresenter";
import {
    BoxedContentValueOrChildrenPresenter,
    ContentValueOrChildrenPresenter
} from "./ContentValueOrChildrenPresenter";

export type TYPES =
    | "content"
    | "content$accordion"
    | "content$tabs"
    | "isaacConceptPage"
    | "isaacQuestionPage"
    | "isaacFastTrackQuestionPage"
    | "isaacEventPage"
    | "isaacTopicSummaryPage"
    | "page"
    | "choices"
    | "choices$freeTextRule"
    | "isaacQuiz"
    | QUESTION_TYPES
    | CHOICE_TYPES
;

export interface PresenterProps<D extends Content = Content> {
    doc: D;
    update: <T extends D>(newContent: T) => void;
}

export type Presenter<D extends Content = Content> = FunctionComponent<PresenterProps<D>>;

interface RegistryEntry {
    name?: string;
    headerPresenter?: Presenter;
    bodyPresenter?: ValuePresenter;
    footerPresenter?: Presenter;
}

const contentEntry: RegistryEntry = {
    headerPresenter: undefined,
    bodyPresenter: ContentValueOrChildrenPresenter,
    footerPresenter: undefined,
};

const choicesEntry: RegistryEntry = {
    ...contentEntry,
    name: "Choices",
};

const choiceEntry: RegistryEntry = {
    name: "Choice",
    footerPresenter: ChoicePresenter,
};

const pageEntry: RegistryEntry = {
    ...contentEntry,
    name: "Page",
};

const accordionEntry: RegistryEntry = {
    ...contentEntry,
    name: "Accordion",
    bodyPresenter: AccordionPresenter,
}

const tabsEntry: RegistryEntry = {
    ...contentEntry,
    name: "Tabs",
    bodyPresenter: TabsPresenter,
}

const questionEntry: RegistryEntry = {
    name: "Question",
    bodyPresenter: BoxedContentValueOrChildrenPresenter,
    footerPresenter: QuestionBodyPresenter,
};

export const REGISTRY: Record<TYPES, RegistryEntry> = {
    content: contentEntry,
    isaacConceptPage: pageEntry,
    isaacEventPage: pageEntry,
    isaacFastTrackQuestionPage: pageEntry,
    isaacQuestionPage: pageEntry,
    isaacQuiz: pageEntry,
    isaacTopicSummaryPage: pageEntry,
    page: pageEntry,
    content$accordion: accordionEntry,
    content$tabs: tabsEntry,
    // Quick questions don't have choices or hints
    isaacQuestion: {...questionEntry, headerPresenter: QuickQuestionPresenter, footerPresenter: AnswerPresenter},
    isaacMultiChoiceQuestion: {...questionEntry, headerPresenter: MultipleChoiceQuestionPresenter},
    choices: choicesEntry,
    choices$freeTextRule: {...choicesEntry, footerPresenter: FreeTextQuestionInstructions},
    choice: choiceEntry,
    isaacNumericQuestion: {...questionEntry, headerPresenter: NumericQuestionPresenter},
    quantity: choiceEntry,
    isaacSymbolicQuestion: {...questionEntry, headerPresenter: SymbolicQuestionPresenter},
    formula: choiceEntry,
    isaacSymbolicChemistryQuestion: {...questionEntry, headerPresenter: ChemistryQuestionPresenter},
    chemicalFormula: choiceEntry,
    isaacStringMatchQuestion: {...questionEntry, headerPresenter: StringMatchQuestionPresenter},
    stringChoice: choiceEntry,
    isaacFreeTextQuestion: {...questionEntry, headerPresenter: StringMatchQuestionPresenter},
    freeTextRule: choiceEntry,
};


export interface SemanticItemProps {
    doc: Content;
    update: (newContent: Content) => void;
    onDelete?: () => void;
    name?: string;
    className?: string;
}

interface BoxProps {
    name?: string | undefined;
    onDelete?: () => void;
    className?: string;
    valueRef?: ValueRef;
}

export const Box: FunctionComponent<BoxProps> = ({name, onDelete, className, valueRef, children}) => {
    const [deleteHovered, setDeleteHovered] = useState(false);
    return <ValueWrapper className={`${styles.box} ${className ?? ""} ${deleteHovered ? styles.boxDeleteHovered : ""}`} valueRef={valueRef}>
        <div className={styles.boxHeader}>
            {name && <span className={styles.boxLabel}>{name}</span>}
            <span className={styles.boxSpacer}/>
            {onDelete && <button className={styles.boxDelete}
                                 onMouseOver={() => setDeleteHovered(true)}
                                 onMouseOut={() => setDeleteHovered(false)}
                                 onFocus={() => setDeleteHovered(true)}
                                 onBlur={() => setDeleteHovered(false)}
                                 onClick={onDelete}>
                ❌</button>}
        </div>
        {children}
    </ValueWrapper>;
};


export function SemanticItem({doc, update, onDelete, name, className}: SemanticItemProps) {
    const valueRef = useRef<ValuePresenterRef>(null);
    const typeWithLayout = `${doc.type}$${doc.layout}` as TYPES;
    const entryType = REGISTRY[typeWithLayout] || REGISTRY[doc.type as TYPES] || REGISTRY.content;

    const MetadataPresenter = entryType.headerPresenter;
    const metadata = MetadataPresenter ? <MetadataPresenter doc={doc} update={update} /> : null;

    const BodyPresenter = entryType.bodyPresenter;
    const body = BodyPresenter ? <BodyPresenter doc={doc} update={update} valueRef={valueRef} /> : null;

    const AdditionalPresenter = entryType.footerPresenter;
    const additional = AdditionalPresenter ? <AdditionalPresenter doc={doc} update={update} /> : null;

    // Render outline with type name
    return <Box name={name || entryType.name} onDelete={onDelete} className={className} valueRef={valueRef}>
        {metadata}
        {body}
        {additional}
    </Box>;
}
