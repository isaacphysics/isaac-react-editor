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
    const {doc, update, name, ...rest} = props;
    const subProps = {doc, update};
    const valueRef = useRef<ValuePresenterRef>(null);

    const [jsonMode, setJsonMode] = useState(false);
    const [showMeta, setShowMeta] = useState(true);

    const entryType = getEntryType(doc);

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
