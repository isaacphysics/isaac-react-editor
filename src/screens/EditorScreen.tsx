import React, { ContextType, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SWRConfig } from "swr";
import { Params, useNavigate, useParams } from "react-router-dom";

import { Selection } from "../components/FileBrowser";
import { LeftMenu } from "../components/LeftMenu";
import { AppContext, browserHistory } from "../App";
import { defaultGithubContext, fetcher, User } from "../services/github";
import { SemanticEditor } from "../components/SemanticEditor";
import { Content } from "../isaac-data-types";

import styles from "../styles/editor.module.css";

function paramsToSelection(params: Readonly<Params>): Selection {
    let path = params["*"];
    if (!path) {
        return null;
    }
    const isDir = path.charAt(path.length - 1) === "/";
    if (isDir) {
        path = path.substring(0, path.length - 1);
    }
    return {
        isDir,
        path,
    };
}

export function EditorScreen() {
    const params = useParams();
    const navigate = useNavigate();

    const selection = paramsToSelection(params);
    const setSelection = useCallback((selection: Selection) => {
        let url = `/edit/${params.branch}`;
        if (selection) {
            url += `/${selection.path}`;
            if (selection.isDir) {
                url += "/";
            }
        }
        navigate(url);
    }, [params.branch, navigate]);

    const userRef = useRef<Promise<User>>(defaultGithubContext.user);
    if (userRef.current === defaultGithubContext.user) {
        userRef.current = fetcher("user");
    }

    const [dirty, setDirty] = useState(false);
    const [currentContent, setCurrentContent] = useState<Content>({});
    const [isAlreadyPublished, setIsAlreadyPublished] = useState<boolean>(false);

    useEffect(() => {
        if (dirty) {
            const unblock = browserHistory.block((tx) => {
                if (!window.confirm("You are currently editing, are you sure you want to discard your changes?")) {
                    return;
                }
                setDirty(false);
                unblock();
                tx.retry();
            });
            return unblock;
        }
    }, [dirty]);

    const appContext = useMemo<ContextType<typeof AppContext>>(() => {
        return ({
            selection: {
                getSelection: () => selection,
                setSelection: (selection: Selection) => {
                    if (dirty) {
                        if (!window.confirm("You are currently editing, are you sure you want to discard your changes?")) {
                            return false;
                        }
                    }
                    setSelection(selection);
                    setDirty(false);
                    return true;
                },
            },
            editor: {
                getDirty: () => dirty,
                getCurrentDoc: () => currentContent,
                setCurrentDoc: (content) => {
                    setCurrentContent(content);
                    setDirty(true);
                },
                loadNewDoc: (content) => {
                    setDirty(false);
                    setIsAlreadyPublished(!!content.published);
                    setCurrentContent(content);
                },
                isAlreadyPublished: () => isAlreadyPublished,
            },
            github: {
                branch: params.branch || defaultGithubContext.branch,
                user: userRef.current,
            },
        });
    }, [params.branch, selection, dirty, setSelection, currentContent, isAlreadyPublished]);

    return <SWRConfig value={{fetcher, revalidateOnFocus: false, revalidateOnReconnect: false}}>
        <AppContext.Provider value={appContext}>
            <div className={styles.editorScreen}>
                <LeftMenu/>
                {selection && !selection.isDir ? <SemanticEditor /> :
                    <div className={styles.centered}>
                        Choose a file on the left to edit
                    </div>}
            </div>
        </AppContext.Provider>
    </SWRConfig>;
}
