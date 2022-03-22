/* tslint:disable */
// Generated using typescript-generator version 2.12.476 on 2022-03-18 17:12:50.

export interface AssignmentDO {
    id?: number;
    gameboardId?: string;
    groupId?: number;
    ownerUserId?: number;
    creationDate?: Date;
    dueDate?: Date;
}

export interface GameboardDO {
    title?: string;
    questions?: string[];
    wildCard?: IsaacWildcard;
    wildCardPosition?: number;
    creationDate?: Date;
    gameFilter?: GameFilter;
    ownerUserId?: number;
    creationMethod?: GameboardCreationMethod;
    tags?: string[];
    _id?: string;
}

export interface IsaacAnvilQuestion extends IsaacQuestionBase {
    anvilApp?: AnvilApp;
}

export interface IsaacCard extends Content {
    image?: Image;
    clickUrl?: string;
    disabled?: boolean;
    verticalContent?: boolean;
}

export interface IsaacCardDeck extends Content {
    cards?: IsaacCard[];
}

export interface IsaacConceptPage extends SeguePage {
}

export interface IsaacEventPage extends Content {
    date?: Date;
    bookingDeadline?: Date;
    prepWorkDeadline?: Date;
    location?: Location;
    preResources?: ExternalReference[];
    postResources?: ExternalReference[];
    eventThumbnail?: Image;
    numberOfPlaces?: number;
    groupReservationLimit?: number;
    allowGroupReservations?: boolean;
    preResourceContent?: Content[];
    emailEventDetails?: string;
    emailConfirmedBookingText?: string;
    emailWaitingListBookingText?: string;
    postResourceContent?: Content[];
    eventStatus?: EventStatus;
    isaacGroupToken?: string;
    address?: Address;
    endDate?: Date;
}

export interface IsaacFastTrackQuestionPage extends IsaacQuestionPage {
}

export interface IsaacFeaturedProfile extends Content {
    emailAddress?: string;
    image?: Image;
    homepage?: string;
}

export interface IsaacFreeTextQuestion extends IsaacQuestionBase {
}

export interface IsaacGraphSketcherQuestion extends IsaacQuestionBase {
}

export interface IsaacItemQuestion extends IsaacQuestionBase {
    items?: Item[];
}

export interface IsaacMultiChoiceQuestion extends IsaacQuestionBase {
}

export interface IsaacNumericQuestion extends IsaacQuestionBase {
    requireUnits?: boolean;
    significantFiguresMin?: number;
    significantFiguresMax?: number;
    availableUnits?: string[];
}

export interface IsaacParsonsQuestion extends IsaacItemQuestion {
    disableIndentation?: boolean;
}

export interface IsaacPod extends Content {
    image?: Image;
    url?: string;
}

export interface IsaacQuestionBase extends ChoiceQuestion {
}

export interface IsaacQuestionPage extends SeguePage {
    difficulty?: number;
    passMark?: number;
    supersededBy?: string;
}

export interface IsaacQuickQuestion extends IsaacQuestionBase {
}

export interface IsaacQuiz extends SeguePage {
    visibleToStudents?: boolean;
}

export interface IsaacQuizSection extends Content {
}

export interface IsaacStringMatchQuestion extends IsaacQuestionBase {
    multiLineEntry?: boolean;
    preserveTrailingWhitespace?: boolean;
}

export interface IsaacSymbolicChemistryQuestion extends IsaacSymbolicQuestion {
}

export interface IsaacSymbolicLogicQuestion extends IsaacSymbolicQuestion {
}

export interface IsaacSymbolicQuestion extends IsaacQuestionBase {
    formulaSeed?: string;
    availableSymbols?: string[];
}

export interface IsaacTopicSummaryPage extends SeguePage {
    linkedGameboards?: string[];
}

export interface IsaacWildcard extends Content {
    description?: string;
    url?: string;
}

export interface QuizAssignmentDO {
    id?: number;
    quizId?: string;
    groupId?: number;
    ownerUserId?: number;
    creationDate?: Date;
    dueDate?: Date;
    quizFeedbackMode?: QuizFeedbackMode;
}

export interface QuizAttemptDO {
    id?: number;
    userId?: number;
    quizId?: string;
    quizAssignmentId?: number;
    startDate?: Date;
    completedDate?: Date;
}

export interface TestCase extends QuestionValidationResponse {
    expected?: boolean;
}

export interface TestQuestion {
    userDefinedChoices?: Choice[];
    testCases?: TestCase[];
}

export interface EventBooking {
    additionalInformation?: { [index: string]: string };
    eventId?: string;
    userId?: number;
    id?: number;
    creationDate?: Date;
    bookingStatus?: BookingStatus;
    reservedById?: number;
    updateDate?: Date;
}

export interface EventBookings {
}

export interface PgEventBooking extends EventBooking {
}

export interface PgEventBookings extends EventBookings {
}

export interface AnvilApp extends Content {
    appId?: string;
    appAccessKey?: string;
}

export interface ChemicalFormula extends Choice {
    mhchemExpression?: string;
}

export interface Choice extends Content {
    correct?: boolean;
    explanation?: ContentBase;
}

export interface ChoiceQuestion extends Question {
    choices?: Choice[];
    randomiseChoices?: boolean;
}

export interface Content extends ContentBase {
    title?: string;
    subtitle?: string;
    author?: string;
    encoding?: string;
    layout?: string;
    children?: ContentBase[];
    value?: string;
    attribution?: string;
    relatedContent?: string[];
    published?: boolean;
    level?: number;
    searchableContent?: string;
}

export interface ContentBase {
    id?: string;
    type?: string;
    tags?: string[];
    canonicalSourceFile?: string;
    version?: string;
}

export interface EmailTemplate extends Content {
    subject?: string;
    plainTextContent?: string;
    htmlContent?: string;
    overrideFromAddress?: string;
    overrideFromName?: string;
    overrideEnvelopeFrom?: string;
    replyToEmailAddress?: string;
    replyToName?: string;
}

export interface ExternalReference {
    title?: string;
    url?: string;
}

export interface Figure extends Image {
}

export interface Formula extends Choice {
    pythonExpression?: string;
    requiresExactMatch?: boolean;
}

export interface FreeTextRule extends Choice {
    caseInsensitive?: boolean;
    allowsAnyOrder?: boolean;
    allowsExtraWords?: boolean;
    allowsMisspelling?: boolean;
    wordProximity?: number;
}

export interface GlossaryTerm extends Content {
    explanation?: Content;
    examBoard?: string;
}

export interface GraphChoice extends Choice {
    graphSpec?: string;
}

export interface Image extends Media {
    clickUrl?: string;
    clickTarget?: string;
}

export interface Item extends Content {
}

export interface ItemChoice extends Choice {
    items?: Item[];
}

export interface LogicFormula extends Choice {
    pythonExpression?: string;
    requiresExactMatch?: boolean;
}

export interface Media extends Content {
    src?: string;
    altText?: string;
}

export interface Notification extends Content {
    externalReference?: ExternalReference;
    expiry?: Date;
}

export interface ParsonsChoice extends ItemChoice {
}

export interface ParsonsItem extends Item {
    indentation?: number;
}

export interface Quantity extends Choice {
    units?: string;
}

export interface Question extends Content {
    answer?: ContentBase;
    hints?: ContentBase[];
}

export interface SeguePage extends Content {
    summary?: string;
}

export interface StringChoice extends Choice {
    caseInsensitive?: boolean;
}

export interface Video extends Media {
}

export interface GameFilter {
    subjects?: string[];
    fields?: string[];
    topics?: string[];
    levels?: number[];
    concepts?: string[];
    questionCategories?: string[];
}

export interface Location {
    address?: Address;
    latitude?: number;
    longitude?: number;
}

export interface Address {
    addressLine1?: string;
    addressLine2?: string;
    town?: string;
    county?: string;
    postalCode?: string;
    country?: string;
}

export interface QuestionValidationResponse extends LightweightQuestionValidationResponse {
    answer?: Choice;
    explanation?: Content;
}

export interface LightweightQuestionValidationResponse {
    questionId?: string;
    correct?: boolean;
    dateAttempted?: Date;
}

export type EventStatus = "OPEN" | "FULLY_BOOKED" | "CANCELLED" | "CLOSED" | "WAITING_LIST_ONLY";

export type GameboardCreationMethod = "FILTER" | "BUILDER";

export type QuizFeedbackMode = "NONE" | "OVERALL_MARK" | "SECTION_MARKS" | "DETAILED_FEEDBACK";

export type BookingStatus = "CONFIRMED" | "CANCELLED" | "WAITING_LIST" | "ATTENDED" | "ABSENT" | "RESERVED";
