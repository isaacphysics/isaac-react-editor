import React, { FunctionComponent, useRef, useState } from "react";
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { json } from "@codemirror/lang-json";

import styles from "./styles.module.css";

import { ValuePresenterRef, ValueRef, ValueWrapper } from "./BaseValuePresenter";
import { Content } from "../../isaac-data-types";
import { getEntryType, PresenterProps } from "./registry";
import { Alert, Button } from "reactstrap";

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
    onDelete?: () => void;
    className?: string;
    valueRef?: ValueRef;
    shift?: Shift;
}

export const Box: FunctionComponent<BoxProps> = ({name, onDelete, shift, className, valueRef, children}) => {
    const [deleteHovered, setDeleteHovered] = useState(false);
    return <ValueWrapper className={`${styles.box} ${className ?? ""} ${deleteHovered ? styles.boxDeleteHovered : ""}`} valueRef={valueRef}>
        <div className={styles.boxHeader}>
            {name && <span className={styles.boxLabel}>{name}</span>}
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
    const valueRef = useRef<ValuePresenterRef>(null);
    const entryType = getEntryType(doc);

    const MetadataPresenter = entryType.headerPresenter;
    const metadata = MetadataPresenter ? <MetadataPresenter doc={doc} update={update} /> : null;

    const BodyPresenter = entryType.bodyPresenter;
    const body = BodyPresenter ? <BodyPresenter doc={doc} update={update} valueRef={valueRef} /> : null;

    const AdditionalPresenter = entryType.footerPresenter;
    const additional = AdditionalPresenter ? <AdditionalPresenter doc={doc} update={update} /> : null;

    // Render outline with type name
    return <Box name={name || entryType.name} {...rest} valueRef={valueRef}>
        {metadata}
        {body}
        {additional}
    </Box>;
}

const SemanticItemInnerMemo = React.memo(SemanticItemInner);

const empty = Symbol("empty") as unknown as string;
function JSONEditor({doc, update}: PresenterProps) {
    const value = useRef(empty);
    if (value.current === empty) {
        value.current = JSON.stringify(doc, null, 2);
    }
    return <>
        <CodeMirror
            value={value.current}
            extensions={[json(), EditorView.lineWrapping]}
            onChange={(newValue) => {
                value.current = newValue;
            }}
        />
        <div className={styles.editButtons}>
            <Button onClick={(e) => {
                value.current = JSON.stringify(doc, null, 2);
            }}>Cancel</Button>
            <Button color="primary" onClick={(e) => {
                update(JSON.parse(value.current));
            }}>Save</Button>
        </div>
    </>;
}

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
                    this.setState({hasError: false});
                }} />
            </Box>;
        }
        return <SemanticItemInnerMemo {...this.props} />;
    }
}
