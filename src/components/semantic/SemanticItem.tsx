import React, { FunctionComponent, useRef, useState } from "react";

import styles from "./styles.module.css";

import {
    BaseValuePresenter,
    ValuePresenterRef,
    ValuePresenter,
    ValueWrapper, ValueRef
} from "./BaseValuePresenter";
import { Content } from "../../isaac-data-types";
import { CHOICE_TYPES, ListChildrenPresenter } from "./ListChildrenPresenter";
import { AccordionPresenter } from "./AccordionPresenter";
import {
    QUESTION_TYPES,
    AnswerPresenter,
    ChemistryQuestionPresenter,
    MultipleChoiceQuestionPresenter,
    NumericQuestionPresenter,
    QuestionBodyPresenter,
    QuickQuestionPresenter,
    SymbolicQuestionPresenter,
    StringMatchQuestionPresenter, FreeTextQuestionInstructions
} from "./QuestionPresenters";
import { TabsPresenter } from "./TabsPresenter";
import { ChoicePresenter } from "./ChoicePresenter";

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
    metadataPresenter?: Presenter;
    childrenPresenter?: Presenter;
    valuePresenter?: ValuePresenter;
    additionalPresenter?: Presenter;
}

const contentEntry: RegistryEntry = {
    metadataPresenter: undefined,
    childrenPresenter: ListChildrenPresenter,
    valuePresenter: BaseValuePresenter,
    additionalPresenter: undefined,
};

const choicesEntry: RegistryEntry = {
    ...contentEntry,
    name: "Choices",
};

const choiceEntry: RegistryEntry = {
    name: "Choice",
    additionalPresenter: ChoicePresenter,
};

const pageEntry: RegistryEntry = {
    ...contentEntry,
    name: "Page",
};

const accordionEntry: RegistryEntry = {
    ...contentEntry,
    name: "Accordion",
    childrenPresenter: AccordionPresenter,
}

const tabsEntry: RegistryEntry = {
    ...contentEntry,
    name: "Tabs",
    childrenPresenter: TabsPresenter,
}


function BoxedListChildrenPresenter(props: PresenterProps) {
    return <Box>
        <ListChildrenPresenter {...props} />
    </Box>;
}

const questionEntry: RegistryEntry = {
    ...contentEntry,
    name: "Question",
    childrenPresenter: BoxedListChildrenPresenter,
    additionalPresenter: QuestionBodyPresenter,
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
    isaacQuestion: {...questionEntry, metadataPresenter: QuickQuestionPresenter, additionalPresenter: AnswerPresenter},
    isaacMultiChoiceQuestion: {...questionEntry, metadataPresenter: MultipleChoiceQuestionPresenter},
    choices: choicesEntry,
    choices$freeTextRule: {...choicesEntry, additionalPresenter: FreeTextQuestionInstructions},
    choice: choiceEntry,
    isaacNumericQuestion: {...questionEntry, metadataPresenter: NumericQuestionPresenter},
    quantity: choiceEntry,
    isaacSymbolicQuestion: {...questionEntry, metadataPresenter: SymbolicQuestionPresenter},
    formula: choiceEntry,
    isaacSymbolicChemistryQuestion: {...questionEntry, metadataPresenter: ChemistryQuestionPresenter},
    chemicalFormula: choiceEntry,
    isaacStringMatchQuestion: {...questionEntry, metadataPresenter: StringMatchQuestionPresenter},
    stringChoice: choiceEntry,
    isaacFreeTextQuestion: {...questionEntry, metadataPresenter: StringMatchQuestionPresenter},
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

    const MetadataPresenter = entryType.metadataPresenter;
    const metadata = MetadataPresenter ? <MetadataPresenter doc={doc} update={update} /> : null;

    const ChildrenPresenter = entryType.childrenPresenter;
    const supressChildren = doc.children === undefined &&  doc.value !== undefined && ChildrenPresenter === BaseValuePresenter;
    const children = !supressChildren && ChildrenPresenter ? <ChildrenPresenter doc={doc} update={update} /> : null;

    const ValuePresenter = entryType.valuePresenter;
    const value = doc.value !== undefined && ValuePresenter ? <ValuePresenter doc={doc} update={update} ref={valueRef} /> : null;

    const AdditionalPresenter = entryType.additionalPresenter;
    const additional = AdditionalPresenter ? <AdditionalPresenter doc={doc} update={update} /> : null;

    // Render outline with type name
    return <Box name={name || entryType.name} onDelete={onDelete} className={className} valueRef={valueRef}>
        {metadata}
        {value}
        {children}
        {additional}
    </Box>;
}
