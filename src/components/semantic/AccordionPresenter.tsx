import React, { useState } from "react";
import { Button } from "reactstrap";

import { Content } from "../../isaac-data-types";
import { PresenterProps, SemanticItem } from "./SemanticItem";
import styles from "./accordion.module.css";
import { deriveNewDoc } from "./ListChildrenPresenter";

export function AccordionPresenter({doc, update}: PresenterProps) {
    const [index, setIndex] = useState(0);

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
                <Button disabled={index === 0} onClick={() => {
                    shift(-1);
                }}>▲</Button>
                <Button disabled={index === (doc.children?.length ?? 1) - 1} onClick={() => {
                    shift(1);
                }}>▼</Button>
                <Button onClick={() => {
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
            <SemanticItem doc={doc.children?.[index] as Content} update={(newContent) => {
                const newDoc = deriveNewDoc(doc);
                newDoc.children[index] = newContent;
                update(newDoc);
            }}/>
        </div>
    </div>;
}
