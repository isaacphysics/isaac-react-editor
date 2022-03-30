import React, { MutableRefObject, useContext, useEffect } from 'react';
import useSWR from "swr";
import { Alert, Spinner } from "reactstrap";

import { AppContext } from "../App";
import { decodeBase64 } from "../utils/base64";
import { SemanticRoot } from "./semantic/SemanticRoot";

export interface EditorState {
    getDirty: () => boolean;
    setDirty: (dirty: boolean) => void;
    currentRef: MutableRefObject<string>;
    previousRef: MutableRefObject<string>;
}

export const defaultEditorState: EditorState = {
    getDirty: () => false,
    setDirty: () => {
        throw new Error("setDirty called outside of AppContext");
    },
    currentRef: {current: ""},
    previousRef: {current: ""},
};

export function SemanticEditor() {
    const appContext = useContext(AppContext);

    const selection = appContext.selection.getSelection();
    const path = selection?.path;
    const {data, error} = useSWR(selection && !selection.isDir ? `repos/$OWNER/$REPO/contents/${path}` : null);

    const decodedContent = data && JSON.parse(decodeBase64(data.content) as string);

    useEffect(() => {
        if (data) {
            appContext.editor.currentRef.current = decodedContent;
            appContext.editor.previousRef.current = decodedContent;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    if (error) {
        return <div>
            <Alert color="error">{error}</Alert>
        </div>;
    }

    if (!data) {
        return <div>
            <Spinner size="large" />
        </div>;
    }

    return <div>
        <SemanticRoot doc={JSON.parse(appContext.editor.currentRef.current)} update={(newContent) => {
            console.log("Top level update", newContent);
            appContext.editor.setDirty(true);
            appContext.editor.currentRef.current = JSON.stringify(newContent); // This is so wrong
        }} />
    </div>;
}
