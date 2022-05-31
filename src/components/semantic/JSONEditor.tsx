import React, { useRef, useState } from "react";
import { Button } from "reactstrap";
import CodeMirror, {rectangularSelection, EditorView} from "@uiw/react-codemirror";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";

import { PresenterProps } from "./registry";
import styles from "./styles/semantic.module.css";

const extensions = [json(), EditorView.lineWrapping, linter(jsonParseLinter()), lintGutter(), rectangularSelection()];
const empty = Symbol("empty") as unknown as string;

export function JSONEditor({doc, update, close}: PresenterProps & { close: () => void }) {
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
            }}>Set</Button>
        </div>
    </>;
}
