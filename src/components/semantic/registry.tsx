import {
    AnswerPresenter,
    ChemistryQuestionPresenter,
    FreeTextQuestionInstructions,
    LogicQuestionPresenter,
    MultipleChoiceQuestionPresenter,
    NumericQuestionPresenter,
    QUESTION_TYPES,
    QuestionBodyPresenter,
    QuickQuestionPresenter,
    StringMatchQuestionPresenter,
    SymbolicQuestionPresenter
} from "./QuestionPresenters";
import { CHOICE_TYPES } from "./ChoiceInserter";
import { TabsPresenter } from "./TabsPresenter";
import React, { FunctionComponent } from "react";
import { ChoicePresenter } from "./ChoicePresenter";
import { Content } from "../../isaac-data-types";
import { FigurePresenter } from "./FigurePresenter";
import { ValuePresenter } from "./BaseValuePresenter";
import {
    BoxedContentValueOrChildrenPresenter,
    ContentValueOrChildrenPresenter
} from "./ContentValueOrChildrenPresenter";
import { AccordionPresenter } from "./AccordionPresenter";
import { ListChildrenPresenter } from "./ListChildrenPresenter";
import { CodeSnippetPresenter } from "./CodeSnippetPresenter";
import { VideoPresenter } from "./VideoPresenter";
import { GlossaryTermPresenter } from "./GlossaryTermPresenter";
import { EmailTemplatePresenter } from "./EmailTemplatePresenter";

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
    | "hints"
    | "figure"
    | "codeSnippet"
    | "image"
    | "video"
    | "glossaryTerm"
    | "emailTemplate"
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
    blankValue?: string;
}

const content: RegistryEntry = {
    headerPresenter: undefined,
    bodyPresenter: ContentValueOrChildrenPresenter,
    footerPresenter: undefined,
};
const choices: RegistryEntry = {
    name: "Choices",
    bodyPresenter: ListChildrenPresenter,
};
const choice: RegistryEntry = {
    name: "Choice",
    footerPresenter: ChoicePresenter,
};
const page: RegistryEntry = {
    ...content,
    name: "Page",
};
const accordion: RegistryEntry = {
    name: "Accordion",
    bodyPresenter: AccordionPresenter,
}
const tabs: RegistryEntry = {
    name: "Tabs",
    bodyPresenter: TabsPresenter,
}
const hints: RegistryEntry = {
    name: "Hints",
    bodyPresenter: (props) => <TabsPresenter {...props} hideTitles/>,
}
const question: RegistryEntry = {
    name: "Question",
    bodyPresenter: BoxedContentValueOrChildrenPresenter,
    footerPresenter: QuestionBodyPresenter,
    blankValue: "Enter question body here",
};
const figure: RegistryEntry = {
    name: "Figure",
    bodyPresenter: FigurePresenter,
    blankValue: "Enter caption here",
};
const codeSnippet: RegistryEntry = {
    name: "Code Snippet",
    bodyPresenter: CodeSnippetPresenter,
};
const video: RegistryEntry = {
    name: "Video",
    bodyPresenter: VideoPresenter,
};
const glossaryTerm: RegistryEntry = {
    name: "Glossary term",
    bodyPresenter: GlossaryTermPresenter,
};
const emailTemplate: RegistryEntry = {
    ...page,
    name: "Email template",
    bodyPresenter: EmailTemplatePresenter,
}

export const REGISTRY: Record<TYPES, RegistryEntry> = {
    content,
    isaacConceptPage: page,
    isaacEventPage: page,
    isaacFastTrackQuestionPage: page,
    isaacQuestionPage: page,
    isaacQuiz: page,
    isaacTopicSummaryPage: page,
    page,
    content$accordion: accordion,
    content$tabs: tabs,
    hints,
    // Quick questions don't have choices or hints
    isaacQuestion: {
        ...question,
        headerPresenter: QuickQuestionPresenter,
        footerPresenter: AnswerPresenter
    },
    isaacMultiChoiceQuestion: {...question, headerPresenter: MultipleChoiceQuestionPresenter},
    choices,
    choices$freeTextRule: {...choices, footerPresenter: FreeTextQuestionInstructions},
    choice: choice,
    isaacNumericQuestion: {...question, headerPresenter: NumericQuestionPresenter},
    quantity: choice,
    isaacSymbolicQuestion: {...question, headerPresenter: SymbolicQuestionPresenter},
    formula: choice,
    isaacSymbolicChemistryQuestion: {...question, headerPresenter: ChemistryQuestionPresenter},
    chemicalFormula: choice,
    isaacStringMatchQuestion: {...question, headerPresenter: StringMatchQuestionPresenter},
    stringChoice: choice,
    isaacFreeTextQuestion: {...question, headerPresenter: StringMatchQuestionPresenter},
    freeTextRule: choice,
    isaacSymbolicLogicQuestion: {...question, headerPresenter: LogicQuestionPresenter},
    logicFormula: choice,
    figure,
    image: figure,
    codeSnippet,
    video,
    glossaryTerm,
    emailTemplate,
};

export function getEntryType(doc: Content) {
    const typeWithLayout = `${doc.type}$${doc.layout}` as TYPES;
    return REGISTRY[typeWithLayout] || REGISTRY[doc.type as TYPES] || REGISTRY.content;
}
