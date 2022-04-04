import { asMetaItems } from "./Metadata";

const TITLE_MAX_LENGTH = 32;

export const MetaItems = asMetaItems({
    id: ["ID", {
        hasWarning: (id) => {
            if (!id.match(/^[a-z0-9_-]+$/)) {
                return "Please alter this ID, as it does not match our required style";
            }
        }
    }],
    title: ["Title", {
        hasWarning: (title) => {
            if (title.length > TITLE_MAX_LENGTH) {
                return "This title is a little long, consider rephrasing 🙂";
            }
        }
    }],
    subtitle: "Subtitle",
    author: "Author",
    appId: "App ID",
    appAccessKey: "Access Key",
    attribution: "Attribution",
    supersededBy: "Superseded By",
    level: ["Level", {type: "number"}],
    summary: "Summary",
    published: ["Published", {type: "checkbox"}],
    altText: "Alt text",
    audience: "Audience",
    deprecated: ["Deprecated", {type: "checkbox"}],
    description: "Description",
    url: "URL",
    relatedContent: ["Related content", {/*type: RelatedContent*/}],
    visibleToStudents: ["Visible to students", {/*type: VisibleToStudents*/}],
    hiddenFromTeachers: ["Hidden from teachers", {/*type: HiddenFromTeachers*/}],
    linkedGameboards: ["Linked gameboards", {/*type: LinkedGambeboards*/}],

    // Events stuff
    emailEventDetails: ["Email Event Details", {type: "textarea"}],
    emailConfirmedBookingText: ["Email Confirmed Booking Text", {type: "textarea"}],
    emailWaitingListBookingText: ["Email Waiting List Booking Text", {type: "textarea"}],
    date: ["Start Date", {type: "date"}],
    end_date: ["End Date", {type: "date"}],
    bookingDeadline: ["Booking Deadline", {type: "date"}],
    prepWorkDeadline: ["Prep-work Deadline", {type: "date"}],
    numberOfPlaces: ["Number of places", {type: "number"}],
    eventStatus: ["Status", {/*type: EventStatus*/}],
    location: ["Location", {/*type: Location */}],
    isaacGroupToken: "Isaac Group Token",
    allowGroupReservations: ["Reservations Enabled", {type: "checkbox"}],
    groupReservationLimit: ["Per-teacher Limit", {type: "number", defaultValue: 10}],
    preResources: ["Pre-Resources", {/*type: Resources*/}],
    postResources: ["Post-Resources", {/*type: Resources*/}],
});
