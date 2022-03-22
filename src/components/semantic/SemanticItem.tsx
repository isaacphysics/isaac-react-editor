import React, { FunctionComponent } from "react";

import styles from "./styles.module.css";

import { ValuePresenter } from "./ValuePresenter";
import { Content } from "../../isaac-data-types";
import { ListChildrenPresenter } from "./ListChildrenPresenter";
import { AccordionPresenter } from "./AccordionPresenter";

type TYPES =
    | "content"
    | "content$accordion"
    | "content$tabs"
    | "isaacConceptPage"
    | "isaacQuestionPage"
    | "isaacFastTrackQuestionPage"
    | "isaacEventPage"
    | "isaacTopicSummaryPage"
    | "page"
    | "isaacQuiz";

export interface PresenterProps {
    doc: Content;
    update: (newContent: Content) => void;
}

export type Presenter = FunctionComponent<PresenterProps>;

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

const pageEntry: RegistryEntry = {
    ...contentEntry,
    name: "Page",
};

const accordionEntry: RegistryEntry = {
    ...contentEntry,
    name: "Accordion",
    childrenPresenter: AccordionPresenter,
}

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
    content$tabs: contentEntry, // TODO: Tabs children presenter
};


interface SemanticItemProps {
    doc: Content;
    update: (newContent: Content) => void;
    onDelete?: () => void;
}

interface BoxProps {
    name: string | undefined;
    onDelete?: () => void;
}

export const Box: FunctionComponent<BoxProps> = ({name, onDelete, children}) =>
    <div className={styles.box}>
        {name && <span className={styles.boxLabel}>{name}</span>}
        {onDelete && <button className={styles.boxDelete} onClick={onDelete}>X</button>}
        {children}
    </div>;

export function SemanticItem({doc, update, onDelete}: SemanticItemProps) {
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
    return <Box name={entryType.name} onDelete={onDelete}>
        {metadata}
        {value}
        {children}
        {additional}
    </Box>;
}
