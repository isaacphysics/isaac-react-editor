import React, { useCallback } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";

import {
    Content,
    ExternalReference,
    IsaacEventPage,
    IsaacQuiz,
    Location,
} from "../../isaac-data-types";
import { useFixedRef } from "../../utils/hooks";
import { useKeyedList } from "../../utils/keyedListHook";

import { asMetaItems, MetaItemPresenter, MetaItemPresenterProps } from "./Metadata";

import styles from "./metadata.module.css";
import { AudiencePresenter } from "./AudiencePresenter";

const TITLE_MAX_LENGTH = 32;

export const MetaItems = asMetaItems({
    id: ["ID", {
        hasWarning: (value) => {
            const id = value as string;
            if (!id.match(/^[a-z0-9_-]+$/)) {
                return "Please alter this ID, as it does not match our required style";
            }
        }
    }],
    title: ["Title", {
        hasWarning: (value) => {
            const title = value as string;
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
    level: ["Level", {type: "number", hasWarning: (value) => {
        const level = value as number; // Already parsed by virtue of type: "number"
        if (isNaN(level) || level < 1 || level > 6) {
            return "Level must be a number between 1 and 6."
        }
    }}],
    summary: "Summary",
    published: ["Published", {type: "checkbox"}],
    altText: "Alt text",
    audience: ["Audience", {presenter: AudiencePresenter}],
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
    date: ["Start Date", {type: "datetime-local"}],
    end_date: ["End Date", {type: "datetime-local"}],
    bookingDeadline: ["Booking Deadline", {type: "datetime-local"}],
    prepWorkDeadline: ["Prep-work Deadline", {type: "datetime-local"}],
    numberOfPlaces: ["Number of places", {type: "number"}],
    eventStatus: ["Status", {type: "select", options: {
        OPEN: "Open",
        CANCELLED: "Cancelled",
        CLOSED: "Closed",
        WAITING_LIST_ONLY: "Waiting List Only",
    }}],
    location: ["Location", {presenter: LocationMetaPresenter}],
    isaacGroupToken: "Isaac Group Token",
    reservations: ["Reservations", {presenter: ReservationsMetaPresenter}],
    preResources: ["Pre-Resources", {presenter: ResourcesMetaPresenter}],
    postResources: ["Post-Resources", {presenter: ResourcesMetaPresenter}],
});


function ReservationsMetaPresenter(props: MetaItemPresenterProps<IsaacEventPage>) {
    const limitId = `${props.id}-limit`
    return <Row className={styles.row}>
        <Col xs={1}>
            <Label for={props.id}>Enabled</Label>
        </Col>
        <Col xs={1}>
            <MetaItemPresenter {...props} prop="allowGroupReservations" name="Reservations Enabled" options={{type: "checkbox"}} />
        </Col>
        {props.doc.allowGroupReservations && <>
            <Col xs={3} className={styles.label}>
                <Label for={`${limitId}`}>Per-teacher Limit</Label>
            </Col>
            <Col xs={5} style={{height: "46px"}}>
                <MetaItemPresenter {...props} id={limitId} prop="groupReservationLimit" name="Per-teacher Limit" options={{type: "number", defaultValue: 10}} />
            </Col>
        </>}
    </Row>;
}


function VisibleToStudents({doc, update, ...rest}: MetaItemPresenterProps<IsaacQuiz>) {
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

    return <Input type="checkbox" {...rest} checked={!!doc.visibleToStudents} onChange={(e) => onChange(e.target.checked)} />;
}

function HiddenFromTeachers({doc, update, ...rest}: MetaItemPresenterProps<IsaacQuiz>) {
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

    return <Input {...rest} type="checkbox" checked={!!doc.hiddenFromRoles?.includes("TEACHER")} onChange={(e) => onChange(e.target.checked)} />;
}

function LocationMetaPresenter({doc, update, prop, id}: MetaItemPresenterProps) {
    const docRef = useFixedRef(doc);
    const location = doc[prop as keyof Content] as Location;

    const locationUpdate = useCallback((location: Content) => {
        update({
            ...docRef.current,
            [prop]: location,
        })
    }, [docRef, prop, update]);
    const locationProps = {doc: location as Content, update: locationUpdate};

    const address = location.address ?? {};
    const addressUpdate = useCallback((address: Content) => {
        update({
            ...docRef.current,
            [prop]: {
                ...docRef.current[prop as keyof Content] as Location,
                address,
            },
        })
    }, [docRef, prop, update]);
    const addressProps = {doc: address as Content, update: addressUpdate};

    return <>
        <MetaItemPresenter {...addressProps} id={id} prop="addressLine1" name="Address Line 1" />
        <MetaItemPresenter {...addressProps} prop="addressLine2" name="Address Line 2" />
        <MetaItemPresenter {...addressProps} prop="town" name="Town" />
        <MetaItemPresenter {...addressProps} prop="county" name="County" />
        <MetaItemPresenter {...addressProps} prop="postalCode" name="Postal Code" />
        <MetaItemPresenter {...addressProps} prop="country" name="Country" />
        <Row>
            <Col xs={5}>
                <Label>
                    Longitude
                    <MetaItemPresenter {...locationProps} prop="longitude" name="Longitude" />
                </Label>
            </Col>
            <Col xs={5}>
                <Label>
                    Latitude
                    <MetaItemPresenter {...locationProps} prop="latitude" name="Latitude" />
                </Label>
            </Col>
        </Row>
    </>;
}

function ResourcesMetaPresenter({doc, update, prop, name}: MetaItemPresenterProps) {
    const docRef = useFixedRef(doc);

    const deriveNewList: () => [Content, ExternalReference[]] = useCallback(() => {
        const newList = [...(docRef.current[prop as keyof Content] as ExternalReference[] ?? [])];
        const newDoc = {
            ...docRef.current,
            [prop]: newList,
        };
        return [newDoc, newList];
    }, [docRef, prop]);
    const {insert, keyList, updateChild, shiftBy, remove} = useKeyedList(doc[prop as keyof Content] as ExternalReference[], deriveNewList, update);

    const resources = doc[prop as keyof Content] as ExternalReference[];

    return <>
        <Row>
            <Col xs={5}>
                Title
            </Col>
            <Col xs={5}>
                URL
            </Col>
        </Row>
        {resources.map((resource, index) => {
            const updateResource = (newContent: ExternalReference) => updateChild(index, newContent);
            return <Row key={keyList[index]}>
                <Col xs={5}>
                    <MetaItemPresenter doc={resource}
                                       update={updateResource}
                                       prop="title" name="Title"/>
                </Col>
                <Col xs={5}>
                    <MetaItemPresenter doc={resource}
                                       update={updateResource}
                                       prop="url" name="URL"/>
                </Col>
                <Col xs={2}>
                    <Button color="link" size="sm" onClick={() => shiftBy(index, -1)} disabled={index <= 0}>▲</Button>
                    <Button color="link" size="sm" onClick={() => shiftBy(index, 1)} disabled={index >= resources.length - 1}>▼</Button>
                    <Button color="link" size="sm" onClick={() => remove(index)}>❌</Button>
                </Col>
            </Row>;
        })}
        <Button onClick={() => insert(resources.length, {title:"Event brochure", url:"somewhere/interesting.pdf"})}>
            Add {name.substring(0, name.length - 1)}
        </Button>
    </>;
}
