/* eslint-disable react/prop-types */
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle, useRef,
    useState
} from "react";
import { Remarkable } from "remarkable";
import { linkify } from "remarkable/linkify";
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { Button } from "reactstrap";

import { PresenterProps } from "./SemanticItem";
import styles from "./value.module.css";


const converter = new Remarkable({
    html: true,
}).use(linkify);

interface ValueViewerProps {
    encoding: string | undefined;
    value: string | undefined;
}

function ValueViewer({encoding, value}: ValueViewerProps) {
    switch (encoding) {
        case "html":
            return <div dangerouslySetInnerHTML={{__html: value || ""}}/>;
        case "markdown":
            return <div dangerouslySetInnerHTML={{__html: converter.render(value || "")}}/>;
        case "plain":
            return <div>{value}</div>;
        default:
            return <div>{`<${encoding}> ${value}`}</div>;
    }
}


export interface ValuePresenterRef {
    startEdit: () => void;
}

export const ValuePresenter = forwardRef<ValuePresenterRef, PresenterProps>(({doc, update}: PresenterProps, ref) => {
    const [editing, setEditing] = useState(false);
    const value = useRef<string>();
    const startEdit = useCallback(() => {
        setEditing(true);
        value.current = doc.value;
    }, [doc]);

    useImperativeHandle(ref, () => ({
        startEdit: () => {
            startEdit();
        }
    }), [startEdit]);

    if (!editing) {
        const value = doc.value;
        const encoding = doc.encoding;
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        return <div onClick={() => startEdit()}>
            <ValueViewer encoding={encoding} value={value} />
        </div>;
    } else {
        return <>
            <CodeMirror
                value={value.current}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                //height="100vh"
                //width="100%"
                extensions={[markdown(), EditorView.lineWrapping]}
                onChange={(newValue) => {
                    value.current = newValue;
                }}
            />
            <div className={styles.editButtons}>
                <Button onClick={() => setEditing(false)}>Cancel</Button>
                <Button color="primary" onClick={() => {
                    setEditing(false);
                    update({...doc, value: value.current});
                }}>Save</Button>
            </div>
        </>;
    }
});

ValuePresenter.displayName = "ValuePresenter";
