/* eslint-disable no-irregular-whitespace */ // For convenient construction of non-breaking spaces in custom strings
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
    emptyDescription: string;
    elementName: string;
    styles: Record<"buttons"|"buttonsSpacer"|"buttonsFill"|"main"|"header"|"hideMargins"|"buttonsShifter"|"empty", string>;
    suppressHeaderNames?: boolean;
};

export function TabsHeader({doc, update, index, setIndex, elementName, styles, suppressHeaderNames}: TabsProps) {
    const elementNameLC = elementName.toLowerCase();
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
                               onClick={() => setIndex(i)}>
                    {!suppressHeaderNames && `${elementName} `}{i + 1}
                </Button>;
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
                Add{!suppressHeaderNames && ` ${elementNameLC}`}
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

export function TabsMain({doc, update, index, setIndex, emptyDescription, elementName, styles, suppressHeaderNames, back, forward, contentHeader, extraButtons}: TabsMainProps) {
    const elementNameLC = elementName.toLowerCase();

    const shift = (by: number) => {
        const newDoc = deriveNewDoc(doc);
        const [item] = newDoc.children.splice(index, 1);
        newDoc.children.splice(index + by, 0, item);
        update(newDoc);
        setIndex(index + by);
    };

    const currentChild = doc.children?.[index] as Content;
    const updateCurrentChild = (newContent: Content) => {
        const newDoc = deriveNewDoc(doc);
        newDoc.children[index] = newContent;
        update(newDoc);
    };
    return <div className={styles.main}>
        {currentChild && <React.Fragment key={currentChild.id || `__index__${index}`}>
            <div className={styles.header}>
                <EditableIDProp doc={currentChild} update={updateCurrentChild} label={`${elementName} ID`}/>
                {extraButtons}
                <Button disabled={index <= 0} onClick={() => shift(-1)}>{back}</Button>
                <Button disabled={index >= (doc.children?.length ?? 1) - 1}
                        onClick={() => shift(1)}>{forward}</Button>
                <Button color="danger" onClick={() => {
                    if (window.confirm(`Are you sure you want to delete this ${elementNameLC}?`)) {
                        const newDoc = deriveNewDoc(doc);
                        newDoc.children.splice(index, 1);
                        update(newDoc);
                        const lastIndex = newDoc.children.length - 1;
                        if (index > lastIndex) {
                            setIndex(lastIndex);
                        }
                    }
                }}>Delete {elementNameLC}</Button>
            </div>
            {contentHeader}
            <SemanticItem className={styles.hideMargins} doc={currentChild} update={updateCurrentChild}/>
        </React.Fragment>}
        {!currentChild && <div className={styles.empty}>
            {emptyDescription}
            <br />
            Click &ldquo;Add{!suppressHeaderNames && ` ${elementNameLC}`}&rdquo; to create a {elementNameLC}.
        </div>}
    </div>;
}

export function TabsPresenter(props: PresenterProps) {
    const [index, setIndex] = useState(0);

    const allProps = {
        ...props,
        index,
        setIndex,
        emptyDescription: "These tabs are empty.",
        elementName: "Tab",
        styles,
        suppressHeaderNames: true,
    };

    return <div className={styles.wrapper}>
        <TabsHeader {...allProps}  />
        <TabsMain {...allProps} back="◀" forward="▶" />
    </div>;
}
