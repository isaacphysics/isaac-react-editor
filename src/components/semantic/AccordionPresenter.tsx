import React, { useRef, useState } from "react";
import { Button, Form } from "reactstrap";

import { Content } from "../../isaac-data-types";
import { PresenterProps, SemanticItem } from "./SemanticItem";
import styles from "./accordion.module.css";
import { deriveNewDoc } from "./ListChildrenPresenter";
import { EditableDocProp } from "./EditableDocProp";
import { EditableText, EditableTextRef } from "./EditableText";

function hasErrorInLevel(newText: string | undefined) {
    if (newText) {
        const newLevel = parseInt(newText, 10);
        if (isNaN(newLevel) || newLevel.toString(10) !== newText || newLevel < 1 || newLevel > 6) {
            return "Level must be a number between 1 and 6";
        }
    }
}

export function AccordionPresenter(props: PresenterProps) {
    const {doc, update} = props;
    const [index, setIndex] = useState(0);

    const editTitleRef = useRef<EditableTextRef>(null);

    const shift = (by: number) => {
        const newDoc = deriveNewDoc(doc);
        const [item] = newDoc.children.splice(index, 1);
        newDoc.children.splice(index + by, 0, item);
        update(newDoc);
        setIndex(index + by);
    };

    return <div className={styles.wrapper}>
        <div className={styles.buttons}>
            <div className={styles.buttonsSpacer} />
            {doc.children?.map((child, i) => {
                return <Button key={child.id || `__index__${i}`}
                               outline
                               color={index === i ? "primary" : undefined}
                               onMouseDown={(e) => {
                                   e.preventDefault();
                               }}
                               onClick={() => setIndex(i)}>Section&nbsp;{i + 1}</Button>;
            })}
            <Button key="__add"
                    outline
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => {
                        const newDoc = deriveNewDoc(doc);
                        newDoc.children.push({type: "content", children: [], __empty: true} as Content);
                        update(newDoc);
                        setIndex(newDoc.children.length - 1);
                    }}>
                Add&nbsp;Section
            </Button>
            <div className={styles.buttonsFill} />
        </div>
        <div className={styles.main}>
            <div className={styles.header}>
                <Form inline>
                    <EditableDocProp {...props} prop="id" label="Section ID" />
                </Form>
                <Button onClick={() => editTitleRef.current?.startEdit()}>Set section title</Button>
                <Form inline>
                    <EditableText onSave={(newLevel) => {
                        const newDoc = {...doc};
                        newDoc.level = newLevel ? parseInt(newLevel, 10) : undefined;
                        update(newDoc);
                    }} text={doc.level?.toString()} label="Section Level" hasError={hasErrorInLevel} {...props} />
                </Form>
                <Button disabled={index === 0} onClick={() => {
                    shift(-1);
                }}>▲</Button>
                <Button disabled={index === (doc.children?.length ?? 1) - 1} onClick={() => {
                    shift(1);
                }}>▼</Button>
                <Button color="danger" onClick={() => {
                    if (window.confirm("Are you sure you want to delete this section?")) {
                        const newDoc = deriveNewDoc(doc);
                        newDoc.children.splice(index, 1);
                        update(newDoc);
                        const lastIndex = newDoc.children.length - 1;
                        if (index > lastIndex) {
                            setIndex(lastIndex);
                        }
                    }
                }}>Delete section</Button>
            </div>
            <h2><EditableDocProp ref={editTitleRef} {...props} prop="title" placeHolder="Section Title" hideWhenEmpty /></h2>
            <h3><EditableDocProp {...props} prop="subtitle" hideWhenEmpty /></h3>
            <SemanticItem doc={doc.children?.[index] as Content} update={(newContent) => {
                const newDoc = deriveNewDoc(doc);
                newDoc.children[index] = newContent;
                update(newDoc);
            }}/>
        </div>
    </div>;
}
