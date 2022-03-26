import React, { useEffect, useRef, useState } from "react";
import { Button, Input } from "reactstrap";

import { PresenterProps } from "./SemanticItem";
import styles from "./accordion.module.css";
import { EditableSubtitleProp, EditableTitleProp } from "./EditableDocProp";
import { EditableText, EditableTextRef } from "./EditableText";
import { TabsHeader, TabsMain } from "./TabsPresenter";
import { deriveNewDoc } from "./ListChildrenPresenter";

function hasErrorInLevel(newText: string | undefined) {
    if (newText) {
        const newLevel = parseInt(newText, 10);
        if (isNaN(newLevel) || newLevel.toString(10) !== newText || newLevel < 1 || newLevel > 6) {
            return "Level must be a number between 1 and 6";
        }
    }
}

type Display = { audience: string[]; nonAudience: string[] };

interface AudienceDisplayControlProps {
    set: (newDisplay: Display | undefined) => void;
    display: { [p: string]: string[] };
}

const audienceOptions = ["open", "closed"];
const nonAudienceOptions = ["closed", "de-emphasised", "hidden"];

function updateSelection(set: (modifier: (current: string[]) => string[]) => void, old: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        set((existing) => {
            const result = [...existing];
            result.splice(existing.indexOf(old), 1, newValue);
            return result;
        })
    };
}

function addSelection(set: (modifier: (current: string[]) => string[]) => void, newValue: string) {
    return () => {
        set((existing) => {
            return [...existing, newValue];
        });
    };
}

function deleteSelection(set: (modifier: (current: string[]) => string[]) => void, old: string) {
    return () => {
        set((existing) => {
            return existing.filter(entry => entry !== old);
        })
    };
}

function getRemainingValues(audienceOptions: string[], audience: string[]) {
    return audienceOptions.filter((option) => !audience.includes(option));
}


interface DisplayListEditorProps {
    displayList: string[];
    setDisplayList: (modifier: (current: string[]) => string[]) => void;
    name: string;
    displayOptions: string[];
}

function DisplayListEditor({displayList, setDisplayList, name, displayOptions}: DisplayListEditorProps) {
    const remainingAudienceValues = getRemainingValues(displayOptions, displayList);
    return <>
        {name}:&nbsp;[
        {displayList.length === 0 && "(default) "}
        {displayList.map((selection, i, selections) =>
            <span key={selection}>
                <Input type="select" bsSize="sm" value={selection} onChange={updateSelection(setDisplayList, selection)}>
                    <option value={selection}>{selection}</option>
                    {remainingAudienceValues.map(option => <option key={option} value={option}>{option}</option>)}
                </Input>
                <Button size="sm" outline onClick={deleteSelection(setDisplayList, selection)}>
                    ➖
                </Button>
                {i < selections.length - 1 && ", "}
            </span>)
        }
        {remainingAudienceValues.length > 0 &&
            <Button size="sm" outline onClick={addSelection(setDisplayList, remainingAudienceValues[0])}>
                ➕
            </Button>
        }
        {"] "}
    </>;
}

function AudienceDisplayControl({display, set}: AudienceDisplayControlProps) {
    const [editing, setEditing] = useState(false);
    const [audience, setAudience] = useState(display.audience ?? []);
    const [nonAudience, setNonAudience] = useState(display.nonAudience ?? []);

    useEffect(() => {
        if (editing) {
            setAudience(display.audience ?? []);
            setNonAudience(display.nonAudience ?? []);
        }
        // Only need to update each time we start editing
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editing]);
    if (!editing) {
        return <>
            {display && (display.audience.length !== 0 || display.nonAudience.length !== 0) ?
                <span>
                    <span>Audience:&nbsp;{display.audience.length ? "[" + display.audience.join(", ") + "]" : "default"}</span>
                    &nbsp;&nbsp;
                    <span>Non-audience:&nbsp;{display.nonAudience.length ? "[" + display.nonAudience.join(", ") + "]" : "default"}</span>
                </span>
                : "default"
            }
            &nbsp;&nbsp;
            <Button onClick={() => setEditing(true)}>Edit</Button>
        </>;
    }
    return <>
        <DisplayListEditor displayList={audience} setDisplayList={setAudience} name="Audience" displayOptions={audienceOptions} />
        <DisplayListEditor displayList={nonAudience} setDisplayList={setNonAudience} name="Non-Audience" displayOptions={nonAudienceOptions} />
        <div className={styles.displayButtons}>
            <Button color="primary" onClick={() => {
                setEditing(false);
                set({audience, nonAudience});
            }}>
                Set
            </Button> &nbsp;
            <Button color="secondary" onClick={() => {
                setEditing(false);
            }}>
                Cancel
            </Button> &nbsp;
            <Button color="danger" onClick={() => {
                setEditing(false);
                set(undefined);
            }}>
                Clear
            </Button>
        </div>
    </>;
}

export function AccordionPresenter(props: PresenterProps) {
    const [index, setIndex] = useState(0);
    const {doc, update} = props;

    const editTitleRef = useRef<EditableTextRef>(null);

    function setCurrentChildDisplay(newDisplay: Display | undefined) {
        const newDoc = deriveNewDoc(doc);
        newDoc.children[index].display = newDisplay;
        update(newDoc);
    }

    const currentChildDisplay = doc?.children?.[index].display;
    return <div className={styles.wrapper}>
        <TabsHeader {...props} index={index} setIndex={setIndex} name="Section" styles={styles} />
        <TabsMain {...props} index={index} setIndex={setIndex} name="Section" styles={styles} back="▲" forward="▼" contentHeader={
            <div className={styles.meta}>
                <h2><EditableTitleProp ref={editTitleRef} {...props}  placeHolder="Section Title" hideWhenEmpty /></h2>
                <h3><EditableSubtitleProp {...props} hideWhenEmpty /></h3>
                <div className={styles.audienceDisplayControls}>
                    {currentChildDisplay === undefined &&
                        <Button onClick={() => {
                            setCurrentChildDisplay({
                                audience: [],
                                nonAudience: []
                            });
                        }}>
                            Override Display
                        </Button>
                    }
                    {currentChildDisplay !== undefined &&
                        <AudienceDisplayControl key={index} display={currentChildDisplay} set={setCurrentChildDisplay} />
                    }
                </div>
            </div>
        } extraButtons={<>
            <Button onClick={() => editTitleRef.current?.startEdit()}>Set section title</Button>
            <EditableText onSave={(newLevel) => {
                props.update({
                    ...props.doc,
                    level: newLevel ? parseInt(newLevel, 10) : undefined,
                });
            }} text={props.doc.level?.toString()} label="Section Level" hasError={hasErrorInLevel} {...props} />
        </>}/>
    </div>;
}
