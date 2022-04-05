import {
    AnswerPresenter,
    ChemistryQuestionPresenter,
    FreeTextQuestionInstructions,
    LogicQuestionPresenter,
    MultipleChoiceQuestionPresenter,
    NumericQuestionPresenter,
    QUESTION_TYPES,
    QuestionBodyPresenter,
    QuestionMetaPresenter,
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
import { AnvilAppPresenter } from "./AnvilAppPresenter";
import {
    EventPagePresenter,
    PagePresenter,
    QuizPagePresenter,
    QuizSectionPresenter
} from "./PagePresenter";
import { PodPresenter } from "./PodPresenter";
import { defaultMeta, MetaItemKey } from "./Metadata";

export type TYPES =
    | "content"
    | "content$accordion"
    | "content$tabs"
    | "isaacConceptPage"
    | "isaacQuestionPage"
    | "isaacFastTrackQuestionPage"
    | "isaacEventPage"
    | "isaacTopicSummaryPage"
    | "isaacPageFragment"
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
    | "anvilApp"
    | "isaacQuizSection"
    | "isaacPod"
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
    metadata?: MetaItemKey[];
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
const mediaMeta: MetaItemKey[] = [...defaultMeta, "altText", "attribution"];
const figure: RegistryEntry = {
    name: "Figure",
    bodyPresenter: FigurePresenter,
    blankValue: "Enter caption here",
    metadata: mediaMeta,
};
const video: RegistryEntry = {
    name: "Video",
    bodyPresenter: VideoPresenter,
    metadata: mediaMeta,
};
const codeSnippet: RegistryEntry = {
    name: "Code Snippet",
    bodyPresenter: CodeSnippetPresenter,
};
const glossaryTerm: RegistryEntry = {
    name: "Glossary term",
    bodyPresenter: GlossaryTermPresenter,
};
const anvilApp: RegistryEntry = {
    name: "Anvil app",
    bodyPresenter: AnvilAppPresenter,
    metadata: [...defaultMeta, "appId", "appAccessKey"],
};
const isaacPod: RegistryEntry = {
    name: "Pod",
    bodyPresenter: PodPresenter,
    metadata: [...defaultMeta, "published"]
};
const emailTemplate: RegistryEntry = {
    ...content,
    name: "Email template",
    bodyPresenter: EmailTemplatePresenter,
    metadata: [...defaultMeta, "published"]
};
const isaacWildcard: RegistryEntry = {
    metadata: [...defaultMeta, "description", "url"],
};

const pageMeta: MetaItemKey[] = ["audience", ...defaultMeta, "relatedContent"];
const pageMetaTail: MetaItemKey[] = ["published", "deprecated"];
const basePage: RegistryEntry = {
    ...content,
    name: "Page",
    headerPresenter: PagePresenter,
    metadata: pageMeta,
};
const contentPage: RegistryEntry = {
    ...basePage,
    metadata: [...pageMeta, ...pageMetaTail, "summary"],
};
const isaacTopicSummaryPage: RegistryEntry = {
    ...contentPage,
    metadata: [...contentPage.metadata ?? [], "linkedGameboards"],
};
const isaacQuestionPage: RegistryEntry = {
    ...basePage,
    metadata: [...pageMeta, "attribution", "level", "supersededBy", ...pageMetaTail],
};
const isaacConceptPage: RegistryEntry = {
    ...isaacQuestionPage,
    metadata: [...isaacQuestionPage.metadata ?? [], "summary"]
};
const isaacEventPage: RegistryEntry = {
    ...basePage,
    name: "Event Page",
    headerPresenter: EventPagePresenter,
    metadata: [...pageMeta, ...pageMetaTail, "emailEventDetails", "emailConfirmedBookingText", "emailWaitingListBookingText", "date", "end_date", "bookingDeadline", "prepWorkDeadline", "numberOfPlaces", "eventStatus", "location", "isaacGroupToken", "reservations", "preResources", "postResources"],
};

const isaacQuiz:RegistryEntry = {
    ...content,
    name: "Quiz",
    headerPresenter: QuizPagePresenter,
    metadata: [...defaultMeta, "level", "visibleToStudents", "hiddenFromTeachers", "published"],
};
const isaacQuizSection = {
    ...content,
    headerPresenter: QuizSectionPresenter,
};


export const REGISTRY: Record<TYPES, RegistryEntry> = {
    content,
    page: contentPage,
    isaacTopicSummaryPage: isaacTopicSummaryPage,
    isaacPageFragment: contentPage,
    isaacConceptPage,
    isaacQuestionPage,
    isaacFastTrackQuestionPage: isaacQuestionPage,
    isaacEventPage,
    isaacQuiz,
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
    isaacGraphSketcherQuestion: {...question, headerPresenter: QuestionMetaPresenter},
    graphChoice: choice,
    figure,
    image: figure,
    codeSnippet,
    video,
    glossaryTerm,
    emailTemplate,
    anvilApp,
    isaacQuizSection,
    isaacPod,
};

export function getEntryType(doc: Content) {
    const typeWithLayout = `${doc.type}$${doc.layout}` as TYPES;
    return REGISTRY[typeWithLayout] || REGISTRY[doc.type as TYPES] || REGISTRY.content;
}
