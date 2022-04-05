import React from "react";
import { Input } from "reactstrap";

import { Content, IsaacQuiz } from "../../isaac-data-types";

import { asMetaItems, MetaItemPresenterProps } from "./Metadata";

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
    level: ["Level", {type: "number", hasWarning: (value: string) => {
        const level = value as unknown as number; // Already parsed by virtue of type: "number"
        if (isNaN(level) || level < 1 || level > 6) {
            return "Level must be a number between 1 and 6."
        }
    }}],
    summary: "Summary",
    published: ["Published", {type: "checkbox"}],
    altText: "Alt text",
    audience: "Audience",
    deprecated: ["Deprecated", {type: "checkbox"}],
    description: "Description",
    url: "URL",
    relatedContent: ["Related content", {/*type: RelatedContent*/}],
    visibleToStudents: ["Visible to students", {presenter: VisibleToStudents}],
    hiddenFromTeachers: ["Hidden from teachers", {presenter: HiddenFromTeachers}],
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

function VisibleToStudents({doc, update}: MetaItemPresenterProps<IsaacQuiz>) {
    const onChange = (visibleToStudents: boolean) => {
        let hiddenFromRoles = doc.hiddenFromRoles;
        if (visibleToStudents) {
            hiddenFromRoles = []; // If students can see it, everyone can see it
        } else {
            // Duplicate not visible into the hidden from roles
            hiddenFromRoles = [...new Set([...hiddenFromRoles ?? [], "STUDENT"]).keys()];
        }
        update({
            ...doc,
            visibleToStudents,
            hiddenFromRoles,
        });
    };

    return <Input type="checkbox" checked={!!doc.visibleToStudents} onChange={(e) => onChange(e.target.checked)} />;
}

function HiddenFromTeachers({doc, update}: MetaItemPresenterProps<IsaacQuiz>) {
    const onChange = (hiddenFromTeachers: boolean) => {
        let visibleToStudents = doc.visibleToStudents;
        let hiddenFromRoles = doc.hiddenFromRoles;
        if (hiddenFromTeachers) {
            hiddenFromRoles = [...new Set([...hiddenFromRoles ?? [], "TEACHER", "STUDENT"]).keys()];
            visibleToStudents = false; // If teachers can't see it, neither can students
        } else {
            hiddenFromRoles = hiddenFromRoles?.filter((role) => role !== "TEACHER");
        }
        update({
            ...doc,
            visibleToStudents,
            hiddenFromRoles,
        });
    };

    return <Input type="checkbox" checked={!!doc.hiddenFromRoles?.includes("TEACHER")} onChange={(e) => onChange(e.target.checked)} />;
}

