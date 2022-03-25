import React, { useRef, useState } from "react";
import { Button } from "reactstrap";

import { PresenterProps } from "./SemanticItem";
import styles from "./accordion.module.css";
import { EditableSubtitleProp, EditableTitleProp } from "./EditableDocProp";
import { EditableText, EditableTextRef } from "./EditableText";
import { TabsHeader, TabsMain } from "./TabsPresenter";

function hasErrorInLevel(newText: string | undefined) {
    if (newText) {
        const newLevel = parseInt(newText, 10);
        if (isNaN(newLevel) || newLevel.toString(10) !== newText || newLevel < 1 || newLevel > 6) {
            return "Level must be a number between 1 and 6";
        }
    }
}

export function AccordionPresenter(props: PresenterProps) {
    const [index, setIndex] = useState(0);

    const editTitleRef = useRef<EditableTextRef>(null);

    return <div className={styles.wrapper}>
        <TabsHeader {...props} index={index} setIndex={setIndex} name="Section" styles={styles} />
        <TabsMain {...props} index={index} setIndex={setIndex} name="Section" styles={styles} back="▲" forward="▼" contentHeader={
            <div className={styles.meta}>
                <h2><EditableTitleProp ref={editTitleRef} {...props}  placeHolder="Section Title" hideWhenEmpty /></h2>
                <h3><EditableSubtitleProp {...props} hideWhenEmpty /></h3>
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
