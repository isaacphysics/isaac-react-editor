import React, { FunctionComponent, useRef, useState } from "react";
import { Alert } from "reactstrap";

import { Content } from "../../isaac-data-types";

import { ValuePresenterRef, ValueRef, ValueWrapper } from "./BaseValuePresenter";
import { getEntryType } from "./registry";
import { JSONEditor } from "./JSONEditor";

import styles from "./styles.module.css";

export interface Shift {
    up: boolean;
    down: boolean;
    by: (amount: number) => void;
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
}

export const Box: FunctionComponent<BoxProps> = ({name, onClick,  onDelete, shift, className, valueRef, children}) => {
    const [deleteHovered, setDeleteHovered] = useState(false);
    return <ValueWrapper className={`${styles.box} ${className ?? ""} ${deleteHovered ? styles.boxDeleteHovered : ""}`} valueRef={valueRef}>
        <div className={styles.boxHeader}>
            {name && <button className={styles.boxLabel} onClick={onClick} disabled={!onClick}>{name}</button>}
            <span className={styles.boxSpacer}/>
            {shift && shift.up && <button className={styles.boxUp}
                                          onClick={() => shift?.by(-1)}>
                ▲
            </button>}
            {shift && shift.down && <button className={styles.boxDown}
                                            onClick={() => shift?.by(1)}>
                    ▼
            </button>}
            {onDelete && <button className={styles.boxDelete}
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

    const entryType = getEntryType(doc);

    const MetadataPresenter = entryType.headerPresenter;
    const metadata = !jsonMode && MetadataPresenter ? <MetadataPresenter {...subProps} /> : null;

    const BodyPresenter = entryType.bodyPresenter;
    const body = jsonMode ? <JSONEditor {...subProps} close={() => setJsonMode(false)} /> : BodyPresenter ? <BodyPresenter {...subProps} valueRef={valueRef} /> : null;

    const AdditionalPresenter = entryType.footerPresenter;
    const additional = !jsonMode && AdditionalPresenter ? <AdditionalPresenter {...subProps} /> : null;

    // Render outline with type name
    return <Box name={name || entryType.name} {...rest} valueRef={valueRef} onClick={() => setJsonMode(true)}>
        {metadata}
        {body}
        {additional}
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
