/* eslint-disable no-irregular-whitespace */  // For convenient construction of non-breaking spaces in custom strings
import React, { MutableRefObject, useCallback, useMemo, useRef, useState } from "react";
import { Button } from "reactstrap";

import { Content } from "../../isaac-data-types";
import { SemanticItem } from "./SemanticItem";
import styles from "./tabs.module.css";
import { deriveNewDoc } from "./ListChildrenPresenter";
import { EditableIDProp, EditableSubtitleProp, EditableTitleProp } from "./EditableDocProp";
import { EditableTextRef } from "./EditableText";
import { safeLowercase } from "../../utils/strings";
import { PresenterProps } from "./registry";
import { useFixedRef } from "../../utils/hooks";

export type TabsProps = {
    docRef: MutableRefObject<Content>;
    update: (newContent: Content) => void;
    index: number;
    setIndex: (newIndex: number) => void;
    emptyDescription: string;
    elementName: string;
    styles: Record<"buttons"|"buttonsSpacer"|"buttonsFill"|"main"|"header"|"hideMargins"|"buttonsShifter"|"empty", string>;
    suppressHeaderNames?: boolean;
    showTitles: boolean;
};

export function TabsHeader({docRef, update, index, setIndex, elementName, styles, suppressHeaderNames, showTitles}: TabsProps) {
    const elementNameLC = safeLowercase(elementName);
    return <div className={styles.buttons}>
        <div className={styles.buttonsShifter}>
            <div className={styles.buttonsSpacer}/>
            {docRef.current.children?.map((child: Content, i) => {
                return <Button key={child.id || `__index__${i}`}
                               outline
                               color={index === i ? "primary" : undefined}
                               onMouseDown={(e) => {
                                   e.preventDefault();
                               }}
                               onClick={() => setIndex(i)}>
                    {!suppressHeaderNames && `${elementName} `}{i + 1}{showTitles && child.title && `: ${child.title}`}
                </Button>;
            })}
            <Button key="__add"
                    outline
                    color="info"
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => {
                        const newDoc = deriveNewDoc(docRef);
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

export function TabsMain({docRef, update, index, setIndex, emptyDescription, elementName, styles, suppressHeaderNames, showTitles, back, forward, contentHeader, extraButtons}: TabsMainProps) {
    const elementNameLC = safeLowercase(elementName);

    const shift = useCallback((by: number) => {
        const newDoc = deriveNewDoc(docRef);
        const [item] = newDoc.children.splice(index, 1);
        newDoc.children.splice(index + by, 0, item);
        update(newDoc);
        setIndex(index + by);
    }, [docRef, index, setIndex, update]);

    const currentChild = docRef.current.children?.[index] as Content;
    const updateCurrentChild = useCallback((newContent: Content) => {
        const newDoc = deriveNewDoc(docRef);
        newDoc.children[index] = newContent;
        update(newDoc);
    }, [docRef, index, update]);
    const doDelete = useCallback(() => {
        if (window.confirm(`Are you sure you want to delete this ${elementNameLC}?`)) {
            const newDoc = deriveNewDoc(docRef);
            newDoc.children.splice(index, 1);
            update(newDoc);
            const lastIndex = newDoc.children.length - 1;
            if (index > lastIndex) {
                setIndex(lastIndex);
            }
        }
    }, [docRef, elementNameLC, index, setIndex, update]);

    return <div className={styles.main}>
        {currentChild && <React.Fragment key={currentChild.id || `__index__${index}`}>
            <div className={styles.header}>
                <EditableIDProp doc={currentChild} update={updateCurrentChild} label={`${elementName} ID`}/>
                {extraButtons}
                <Button disabled={index <= 0} onClick={() => shift(-1)}>{back}</Button>
                <Button disabled={index >= (docRef.current.children?.length ?? 1) - 1}
                        onClick={() => shift(1)}>{forward}</Button>
                <Button color="danger" onClick={doDelete}>Delete {elementNameLC}</Button>
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

export function useCurrentChild(docRef: React.MutableRefObject<Content>, update: <T extends Content>(newContent: T) => void, index: number) {
    const currentChild = docRef.current.children?.[index] as Content | undefined;
    const updateCurrentChild = useCallback((newContent: Content) => {
        const newDoc = deriveNewDoc(docRef);
        newDoc.children[index] = newContent;
        update(newDoc);
    }, [docRef, index, update]);
    const currentChildProps = useMemo(() => ({
            doc: currentChild as Content,
            update: updateCurrentChild
        }),
        [currentChild, updateCurrentChild]);
    return {currentChild, updateCurrentChild, currentChildProps};
}

export function TabsPresenter({hideTitles, ...props}: PresenterProps & {hideTitles?: boolean}) {
    const {doc, update} = props;
    const [index, setIndex] = useState(0);
    const docRef = useFixedRef(doc);

    const editTitleRef = useRef<EditableTextRef>(null);

    const showTitles = !hideTitles;
    const allProps: TabsProps = {
        docRef,
        update,
        index,
        setIndex,
        emptyDescription: "These tabs are empty.",
        elementName: "Tab",
        styles,
        suppressHeaderNames: true,
        showTitles,
    };

    const {
        currentChild,
        currentChildProps
    } = useCurrentChild(docRef, update, index);

    return <div className={styles.wrapper}>
        <TabsHeader {...allProps} />
        <TabsMain {...allProps} back="◀" forward="▶" contentHeader={
            showTitles && currentChild ? <div className={styles.meta}>
                <h3><EditableTitleProp ref={editTitleRef} {...currentChildProps}
                                       placeHolder="Tab title" hideWhenEmpty /></h3>
            </div> : undefined
        } extraButtons={<>
            {showTitles && currentChild && !currentChild.title && <Button onClick={() => editTitleRef.current?.startEdit()}>Set tab title</Button>}
        </>}/>
    </div>;
}
