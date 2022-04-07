import {
    AnswerPresenter,
    FreeTextQuestionInstructions, ItemChoiceItemPresenter,
    ItemOrParsonsQuestionPresenter,
    ItemPresenter,
    MultipleChoiceQuestionPresenter,
    NumericQuestionPresenter,
    QUESTION_TYPES,
    QuestionFooterPresenter,
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
import { CardDeckPresenter, CardPresenter } from "./CardPresenter";
import { MetaItems } from "./metaItems";

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
    | "isaacCard"
    | "isaacCardDeck"
    | "isaacWildcard"
    | "item"
    | "parsonsItem"
    | "item$choice"
    | QUESTION_TYPES
    | CHOICE_TYPES
;

export interface PresenterProps<D = Content> {
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
    bodyPresenter: ChoicePresenter,
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
    footerPresenter: QuestionFooterPresenter,
    blankValue: "Enter question body here",
};
const isaacSymbolicQuestion = {
    ...question,
    headerPresenter: SymbolicQuestionPresenter,
};
const isaacStringMatchQuestion = {
    ...question,
    headerPresenter: StringMatchQuestionPresenter,
};
const isaacParsonsQuestion = {
    ...question,
    bodyPresenter: ItemOrParsonsQuestionPresenter,
    footerPresenter: undefined,
};
const item = {
    bodyPresenter: ItemPresenter,
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
const isaacCard: RegistryEntry = {
    name: "Card",
    bodyPresenter: CardPresenter,
};
const isaacCardDeck: RegistryEntry = {
    name: "Card Deck",
    bodyPresenter: CardDeckPresenter,
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

const isaacWildcard: RegistryEntry = {
    name: "Wildcard",
    headerPresenter: PagePresenter,
    metadata: [...defaultMeta, "description", "url"],
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
    isaacWildcard,
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
    isaacSymbolicQuestion,
    formula: choice,
    isaacSymbolicChemistryQuestion: isaacSymbolicQuestion,
    chemicalFormula: choice,
    isaacSymbolicLogicQuestion: isaacSymbolicQuestion,
    logicFormula: choice,
    isaacStringMatchQuestion,
    stringChoice: choice,
    isaacFreeTextQuestion: isaacStringMatchQuestion,
    freeTextRule: choice,
    isaacRegexMatchQuestion: isaacStringMatchQuestion,
    regexPattern: choice,
    isaacGraphSketcherQuestion: {...question, headerPresenter: QuestionMetaPresenter},
    graphChoice: choice,
    isaacItemQuestion: isaacParsonsQuestion,
    isaacParsonsQuestion: isaacParsonsQuestion,
    itemChoice: choice,
    parsonsChoice: choice,
    item,
    parsonsItem: item,
    item$choice: {bodyPresenter: ItemChoiceItemPresenter},
    figure,
    image: {...figure, name: "Image"},
    codeSnippet,
    video,
    glossaryTerm,
    emailTemplate,
    anvilApp,
    isaacQuizSection,
    isaacPod,
    isaacCard,
    isaacCardDeck,
};

const unknown: RegistryEntry = {
    ...content,
    name: "Unknown",
    metadata: Object.keys(MetaItems) as MetaItemKey[],
};

export function getEntryType(doc: Content, layoutOverride?: string) {
    const typeWithLayout = `${doc.type}$${layoutOverride || doc.layout}` as TYPES;
    if (layoutOverride) {
        console.log("layoutOverride", layoutOverride, doc, typeWithLayout, REGISTRY[typeWithLayout]);
    }
    return REGISTRY[typeWithLayout] || REGISTRY[doc.type as TYPES] || unknown;
}
