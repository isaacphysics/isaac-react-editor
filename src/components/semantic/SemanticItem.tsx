import React, { FunctionComponent, useState } from "react";

import styles from "./styles.module.css";

import { ValuePresenter } from "./ValuePresenter";
import { Content } from "../../isaac-data-types";
import { ListChildrenPresenter } from "./ListChildrenPresenter";
import { AccordionPresenter } from "./AccordionPresenter";
import {
    MultipleChoiceQuestionPresenter, NumericQuestionPresenter,
    QuestionMetaPresenter,
    QuickQuestionAnswerPresenter, SymbolicQuestionPresenter
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
    | "isaacQuiz"
    | "isaacQuestion"
    | "isaacMultiChoiceQuestion"
    | "choices"
    | "choice"
    | "isaacNumericQuestion"
    | "quantity"
    | "isaacSymbolicQuestion"
    | "formula"
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
    valuePresenter?: Presenter;
    additionalPresenter?: Presenter;
}

const contentEntry: RegistryEntry = {
    metadataPresenter: undefined,
    childrenPresenter: ListChildrenPresenter,
    valuePresenter: ValuePresenter,
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
    metadataPresenter: QuestionMetaPresenter,
    childrenPresenter: BoxedListChildrenPresenter,
};

export const REGISTRY: {[key in TYPES]: RegistryEntry} = {
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
    isaacQuestion: {...questionEntry, additionalPresenter: QuickQuestionAnswerPresenter},
    isaacMultiChoiceQuestion: {...questionEntry, additionalPresenter: MultipleChoiceQuestionPresenter},
    choices: choicesEntry,
    choice: choiceEntry,
    isaacNumericQuestion: {...questionEntry, additionalPresenter: NumericQuestionPresenter},
    quantity: choiceEntry,
    isaacSymbolicQuestion: {...questionEntry, additionalPresenter: SymbolicQuestionPresenter},
    formula: choiceEntry,
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
}

export const Box: FunctionComponent<BoxProps> = ({name, onDelete, className, children}) => {
    const [deleteHovered, setDeleteHovered] = useState(false);
    return <div className={`${styles.box} ${className ?? ""} ${deleteHovered ? styles.boxDeleteHovered : ""}`}>
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
    </div>;
};

export function SemanticItem({doc, update, onDelete, name, className}: SemanticItemProps) {
    const typeWithLayout = `${doc.type}$${doc.layout}` as TYPES;
    const entryType = REGISTRY[typeWithLayout] || REGISTRY[doc.type as TYPES] || REGISTRY.content;

    const MetadataPresenter = entryType.metadataPresenter;
    const metadata = MetadataPresenter ? <MetadataPresenter doc={doc} update={update} /> : null;

    const ChildrenPresenter = entryType.childrenPresenter;
    const children = doc.children && ChildrenPresenter ? <ChildrenPresenter doc={doc} update={update} /> : null;

    const ValuePresenter = entryType.valuePresenter;
    const value = doc.value && ValuePresenter ? <ValuePresenter doc={doc} update={update} /> : null;

    const AdditionalPresenter = entryType.additionalPresenter;
    const additional = AdditionalPresenter ? <AdditionalPresenter doc={doc} update={update} /> : null;

    // Render outline with type name
    return <Box name={name || entryType.name} onDelete={onDelete} className={className}>
        {metadata}
        {value}
        {children}
        {additional}
    </Box>;
}
