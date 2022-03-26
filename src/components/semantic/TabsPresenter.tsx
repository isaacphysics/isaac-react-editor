import React, { useState } from "react";
import { Button } from "reactstrap";

import { Content } from "../../isaac-data-types";
import { PresenterProps, SemanticItem } from "./SemanticItem";
import styles from "./tabs.module.css";
import { deriveNewDoc } from "./ListChildrenPresenter";
import { EditableIDProp } from "./EditableDocProp";

type TabsProps = PresenterProps & {
    index: number;
    setIndex: (newIndex: number) => void;
    name: string;
    styles: Record<"buttons"|"buttonsSpacer"|"buttonsFill"|"main"|"header"|"hideMargins"|"buttonsShifter", string>;
};

export function TabsHeader({doc, update, index, setIndex, name, styles}: TabsProps) {
    return <div className={styles.buttons}>
        <div className={styles.buttonsShifter}>
            <div className={styles.buttonsSpacer}/>
            {doc.children?.map((child, i) => {
                return <Button key={child.id || `__index__${i}`}
                               outline
                               color={index === i ? "primary" : undefined}
                               onMouseDown={(e) => {
                                   e.preventDefault();
                               }}
                               onClick={() => setIndex(i)}>{name ? `${name} ` : ""}{i + 1}</Button>;
            })}
            <Button key="__add"
                    outline
                    color="info"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => {
                        const newDoc = deriveNewDoc(doc);
                        newDoc.children.push({type: "content", children: []} as Content);
                        update(newDoc);
                        setIndex(newDoc.children.length - 1);
                    }}>
                Add&nbsp;{name}
            </Button>
            <div className={styles.buttonsFill}/>
        </div>
    </div>;
}

type TabsMainProps = TabsProps & {
    back: string;
    forward: string;
    contentHeader?: JSX.Element;
    extraButtons?: JSX.Element;
};

export function TabsMain({doc, update, index, setIndex, name, styles, back, forward, contentHeader, extraButtons}: TabsMainProps) {
    const nameLC = name.toLowerCase();

    const shift = (by: number) => {
        const newDoc = deriveNewDoc(doc);
        const [item] = newDoc.children.splice(index, 1);
        newDoc.children.splice(index + by, 0, item);
        update(newDoc);
        setIndex(index + by);
    };

    return <div className={styles.main}>
        <div className={styles.header}>
            <EditableIDProp doc={doc} update={update} label={`${name} ID`}/>
            {extraButtons}
            <Button disabled={index === 0} onClick={() => shift(-1)}>{back}</Button>
            <Button disabled={index === (doc.children?.length ?? 1) - 1}
                    onClick={() => shift(1)}>{forward}</Button>
            <Button color="danger" onClick={() => {
                if (window.confirm(`Are you sure you want to delete this ${nameLC}?`)) {
                    const newDoc = deriveNewDoc(doc);
                    newDoc.children.splice(index, 1);
                    update(newDoc);
                    const lastIndex = newDoc.children.length - 1;
                    if (index > lastIndex) {
                        setIndex(lastIndex);
                    }
                }
            }}>Delete {nameLC}</Button>
        </div>
        {contentHeader}
        <SemanticItem className={styles.hideMargins} doc={doc.children?.[index] as Content} update={(newContent) => {
            const newDoc = deriveNewDoc(doc);
            newDoc.children[index] = newContent;
            update(newDoc);
        }}/>
    </div>;
}

export function TabsPresenter(props: PresenterProps) {
    const [index, setIndex] = useState(0);

    return <div className={styles.wrapper}>
        <TabsHeader {...props} index={index} setIndex={setIndex} name="" styles={styles} />
        <TabsMain {...props} index={index} setIndex={setIndex} name="Tab" styles={styles} back="◀" forward="▶" />
    </div>;
}
