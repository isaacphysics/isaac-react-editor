/**
 * The main entry point for the editor is SemanticItem.
 *
 * SemanticItem displays each item based on a set of "presenters" for each type (and layout) of content.
 * Each item is displayed with various optional features:
 * - name label (like "Accordion")
 * - delete button
 * - buttons for moving that item up/down within a list
 * - metadata editing toggle
 *
 * Each item is configured in registry.tsx based on the type (and optionally layout) of the content.
 * We overload layout for some internal purposes such as recording the correct type of choice when
 * presenting a list of choices.
 *
 * The body of each item is made up of 3 presenters:
 * - a header presenter (showing things like title and subtitle)
 * - a body presenter (which functions like ContentValueOrChildren in the front-end)
 * - a footer presenter (e.g. for answers in questions)
 *
 * Each presenter receives the whole Content object (making it easier for e.g. the ListChildrenPresenter
 * to do different things with different types of content), and an update function.
 *
 * The body of an item can also show a metadata block ahead of the header which is configured with
 * the metadata field in the registry (and is less directly customisable).
 *
 * Clicking on the name label toggles a JSON editor to directly edit the content. The JSON editor is
 * also shown in the case of any error with parsing the JSON or an error in a Presenter.
 *
 * Clicking elsewhere in the header or empty space of the item starts editing the value (if possible)
 * This was to make it easier to click empty values to initiate editing.
 *
 * Each item is passed an update function which is used to save changes. Each time a sub-presenter
 * is created for a piece of sub-content (e.g. for each child in children), an update function is
 * created that bubbles up the update to that child. In this way, Presenter has a uniform interface.
 */

import React, { FunctionComponent, MouseEvent, useRef, useState } from "react";
import { Alert } from "reactstrap";

import { Content } from "../../isaac-data-types";

import { ValuePresenterRef, ValueRef, ValueWrapper } from "./BaseValuePresenter";
import { getEntryType } from "./registry";
import { JSONEditor } from "./JSONEditor";

import styles from "./styles.module.css";
import { MetadataPresenter } from "./Metadata";

interface Shift {
    up: boolean;
    down: boolean;
    by: (amount: number, e: MouseEvent) => void;
}

interface Metadata {
    toggle: () => void;
    showMeta: boolean;
}

export interface SemanticItemProps {
    doc: Content;
    update: (newContent: Content) => void;
    onDelete?: () => void;
    name?: string;
    className?: string;
    shift?: Shift;
    layout?: string;
}

interface BoxProps {
    name?: string | undefined;
    onClick?: () => void;
    onDelete?: () => void;
    className?: string;
    valueRef?: ValueRef;
    shift?: Shift;
    metadata?: Metadata;
}

export const Box: FunctionComponent<BoxProps> = ({name, onClick,  onDelete, shift, metadata, className, valueRef, children}) => {
    const [deleteHovered, setDeleteHovered] = useState(false);
    return <ValueWrapper className={`${styles.box} ${className ?? ""} ${deleteHovered ? styles.boxDeleteHovered : ""}`} valueRef={valueRef}>
        <div className={styles.boxHeader}>
            {name && <button className={styles.boxLabel} onClick={onClick} disabled={!onClick}>{name}</button>}
            {metadata && <button className={styles.metaLabel} onClick={() => metadata.toggle()}>{metadata.showMeta ? "Hide" : "Show"} metadata</button>}
            <span className={styles.boxSpacer}/>
            {shift && shift.up && <button className={`${styles.iconButton} ${styles.boxUp}`}
                                          onClick={(e) => shift?.by(-1, e)}>
                ▲
            </button>}
            {shift && shift.down && <button className={`${styles.iconButton} ${styles.boxDown}`}
                                            onClick={(e) => shift?.by(1, e)}>
                    ▼
            </button>}
            {onDelete && <button className={`${styles.iconButton} ${styles.boxDelete}`}
                                 onMouseOver={() => setDeleteHovered(true)}
                                 onMouseOut={() => setDeleteHovered(false)}
                                 onFocus={() => setDeleteHovered(true)}
                                 onBlur={() => setDeleteHovered(false)}
                                 onClick={onDelete}>
                ❌
            </button>}
        </div>
        {children}
    </ValueWrapper>;
};

function SemanticItemInner(props: SemanticItemProps) {
    const {doc, update, name, layout, ...rest} = props;
    const subProps = {doc, update};
    const valueRef = useRef<ValuePresenterRef>(null);

    const [jsonMode, setJsonMode] = useState(false);
    const [showMeta, setShowMeta] = useState(false);

    const entryType = getEntryType(doc, layout);

    const metadata = entryType.metadata;
    const meta = metadata && showMeta && !jsonMode && <div className={styles.metadata}>
        <MetadataPresenter {...subProps} metadata={metadata} />
    </div>;

    const HeaderPresenter = entryType.headerPresenter;
    const header = !jsonMode && HeaderPresenter ? <HeaderPresenter {...subProps} /> : null;

    const BodyPresenter = entryType.bodyPresenter;
    const body = jsonMode ? <JSONEditor {...subProps} close={() => setJsonMode(false)} /> : BodyPresenter ? <BodyPresenter {...subProps} valueRef={valueRef} /> : null;

    const FooterPresenter = entryType.footerPresenter;
    const footer = !jsonMode && FooterPresenter ? <FooterPresenter {...subProps} /> : null;

    // Render outline with type name
    return <Box name={name || entryType.name}
                {...rest}
                valueRef={valueRef}
                onClick={() => setJsonMode(true)}
                metadata={metadata && !jsonMode ? {toggle: () => setShowMeta(!showMeta), showMeta} : undefined}>
        {meta}
        {header}
        {body}
        {footer}
    </Box>;
}

const SemanticItemInnerMemo = React.memo(SemanticItemInner);

export class SemanticItem extends React.Component<SemanticItemProps, { hasError: boolean; error: string; content?: string }> {
    constructor(props: SemanticItemProps) {
        super(props);
        this.state = {hasError: false, error: ""};
    }

    static getDerivedStateFromError(error: {message: string}) {
        return { hasError: true, error: error.message };
    }

    render() {
        const {doc, update, name, ...rest} = this.props;
        const entryType = getEntryType(doc);
        if (this.state.hasError) {
            return <Box name={name || entryType.name} {...rest}>
                <Alert color="danger">
                    <b>Error editing this component</b>
                    <br />
                    <small>{this.state.error}</small>
                </Alert>
                <JSONEditor {...this.props} update={(newContent) => {
                    this.props.update(newContent);
                }} close={() => {
                    this.setState({hasError: false});
                }}/>
            </Box>;
        }
        return <SemanticItemInnerMemo {...this.props} />;
    }
}
