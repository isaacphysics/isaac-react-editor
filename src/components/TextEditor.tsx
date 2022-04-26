import React, { useContext, useEffect } from 'react';
import { Alert, Spinner } from "reactstrap";
import CodeMirror, { EditorView } from '@uiw/react-codemirror';

import { AppContext } from "../App";
import { decodeBase64 } from "../utils/base64";
import { useGithubContents } from "../services/github";

import styles from "../styles/editor.module.css";
import { TopMenu } from "./TopMenu";

export function TextEditor() {
    const appContext = useContext(AppContext);

    const selection = appContext.selection.getSelection();
    const path = selection?.path;
    const {data, error} = useGithubContents(appContext, path);

    useEffect(() => {
        if (data) {
            const decodedContent = data && decodeBase64(data.content);
            appContext.editor.loadNewDoc(decodedContent as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    if (error) {
        return <div className={styles.centered}>
            <Alert color="danger">{error}</Alert>
        </div>;
    }

    if (!data) {
        return <div className={styles.centered}>
            <Spinner size="large" />
        </div>;
    }

    return <div className={styles.editorWrapper}>
        <TopMenu />
        <CodeMirror
            key={path} // Force replacement of this component instead of updating when path changes
            className={styles.textEditor}
            value={appContext.editor.getCurrentDocAsString()}
            height="calc(100vh - 40px)"
            width="100%"
            extensions={[EditorView.lineWrapping]}
            onChange={(value) => {
                appContext.editor.setCurrentDoc(value);
            }}
        />
    </div>;
}
