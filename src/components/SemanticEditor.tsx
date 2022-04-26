import React, { useContext, useEffect } from 'react';
import { Alert, Spinner } from "reactstrap";

import { AppContext } from "../App";
import { decodeBase64 } from "../utils/base64";
import { Content } from '../isaac-data-types';
import { SemanticRoot } from "./semantic/SemanticRoot";

import styles from "../styles/editor.module.css";
import { useGithubContents } from "../services/github";
import { TopMenu } from "./TopMenu";


export interface EditorState {
    getDirty: () => boolean;
    getCurrentDoc: () => Content;
    getCurrentDocAsString: () => string;
    setCurrentDoc: (newContent: Content|string) => void;
    loadNewDoc: (newContent: Content|string) => void;
    isAlreadyPublished: () => boolean;
}

export const defaultEditorState: EditorState = {
    getDirty: () => false,
    getCurrentDoc: () => ({}),
    getCurrentDocAsString: () => "",
    setCurrentDoc: () => {
        throw new Error("setCurrentDoc called outside of AppContent");
    },
    loadNewDoc: () => {
        throw new Error("loadNewDoc called outside of AppContent");
    },
    isAlreadyPublished: () => false,
};

function decodeContent(data: {content: string}) {
    return JSON.parse(decodeBase64(data.content) as string);
}

export function SemanticEditor() {
    const appContext = useContext(AppContext);

    const selection = appContext.selection.getSelection();
    const path = selection?.path;
    const {data, error} = useGithubContents(appContext, selection && !selection.isDir && path);

    useEffect(() => {
        if (data) {
            const decodedContent = decodeContent(data);
            appContext.editor.loadNewDoc(decodedContent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appContext.editor.loadNewDoc, data]);

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
        <SemanticRoot doc={appContext.editor.getCurrentDoc()} update={(newContent) => {
            appContext.editor.setCurrentDoc(newContent);
        }} />
    </div>;
}
