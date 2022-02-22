import React, { MutableRefObject, useContext, useEffect } from 'react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { AppContext } from "../App";
import useSWR from "swr";
import { Alert, Spinner } from "reactstrap";
import { decodeBase64 } from "../utils/base64";


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

export function Editor() {
    const appContext = useContext(AppContext);

    const selection = appContext.selection.getSelection();
    const path = selection?.path;
    const {data, error} = useSWR(selection && !selection.isDir ? `repos/$OWNER/$REPO/contents/${path}` : null);

    const decodedContent = data && decodeBase64(data.content);

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
        <CodeMirror
            key={path} // Force replacement of this component instead of updating when path changes
            value={decodedContent}
            height="100vh"
            width="100%"
            extensions={[json(), EditorView.lineWrapping]}
            onChange={(value) => {
                appContext.editor.setDirty(value !== appContext.editor.previousRef.current);
                appContext.editor.currentRef.current = value;
            }}
        />
    </div>;
}
