import React, { FunctionComponent, useRef, useState } from "react";
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { linter } from '@codemirror/lint';
import { json, jsonParseLinter } from '@codemirror/lang-json';

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

const extensions = [json(), EditorView.lineWrapping, linter(jsonParseLinter())];

const empty = Symbol("empty") as unknown as string;
function JSONEditor({doc, update, close}: PresenterProps & {close: () => void}) {
    const value = useRef(empty);
    if (value.current === empty) {
        value.current = JSON.stringify(doc, null, 2);
    }
    const [valid, setValid] = useState(true);
    return <>
        <CodeMirror
            value={value.current}
            maxHeight="calc(100vh - 120px)"
            extensions={extensions}
            onChange={(newValue) => {
                value.current = newValue;
                try {
                    JSON.parse(newValue);
                    setValid(true);
                } catch (e) {
                    console.error(e);
                    setValid(false);
                }
            }}
        />
        <div className={styles.editButtons}>
            <Button onClick={() => {
                value.current = JSON.stringify(doc, null, 2);
                close();
            }}>Cancel</Button>
            <Button color="primary" disabled={!valid} onClick={() => {
                update(JSON.parse(value.current));
                close();
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
                }} close={() => {
                    this.setState({hasError: false});
                }}/>
            </Box>;
        }
        return <SemanticItemInnerMemo {...this.props} />;
    }
}
