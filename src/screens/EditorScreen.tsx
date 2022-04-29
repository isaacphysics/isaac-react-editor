import React, { ContextType, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SWRConfig, useSWRConfig } from "swr";
import { Params, useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router";
import { Modal, Spinner } from "reactstrap";

import { Selection } from "../components/FileBrowser";
import { LeftMenu } from "../components/LeftMenu";
import { AppContext, browserHistory } from "../App";
import { defaultGithubContext, fetcher } from "../services/github";
import { SemanticEditor } from "../components/SemanticEditor";
import { Content } from "../isaac-data-types";
import { Action, doDispatch } from "../services/commands";
import { useFixedRef } from "../utils/hooks";
import { TextEditor } from "../components/TextEditor";
import { Preview, PreviewMode } from "../components/Preview";

import { MenuModal, MenuModalRef } from "./MenuModal";

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
    const location = useLocation();
    const menuRef = useRef<MenuModalRef>(null);

    const swrConfig = useSWRConfig();

    const [previewMode, setPreviewMode] = useState<PreviewMode>(window.innerWidth > 1400 ? "panel" : "modal");
    const [previewOpen, setPreviewOpen] = useState(false);

    const selection = paramsToSelection(params);
    const setSelection = useCallback((selection: Selection) => {
        let url = `/edit/${params.branch}`;
        if (selection) {
            url += `/${selection.path}`;
            if (selection.isDir) {
                url += "/";
            }
        }
        if (url !== location.pathname) {
            navigate(url);
        }
    }, [params.branch, navigate, location.pathname]);

    const [user, setUser] = useState(defaultGithubContext.user);
    useEffect(() => {
        fetcher("user").then(setUser);
    }, []);

    const [dirty, setDirty] = useState(false);
    const [currentContent, setCurrentContent] = useState<Content|string>({});
    const [isAlreadyPublished, setIsAlreadyPublished] = useState<boolean>(false);

    const [actionRunning, setActionRunning] = useState(false);

    const unblockRef = useRef<() => void>();
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
            unblockRef.current = unblock;
            return unblock;
        }
    }, [dirty]);

    const setCurrentDoc = useCallback((content: Content|string) => {
        setCurrentContent(content);
        setDirty(true);
    }, []);
    const loadNewDoc = useCallback((content: Content|string) => {
        setDirty(false);
        setIsAlreadyPublished(typeof content === "string" ? false : !!content.published);
        setCurrentContent(content);
    }, []);

    const appContext = useMemo<ContextType<typeof AppContext>>(() => {
        async function dispatch(action: Action) {
            try {
                setActionRunning(true);
                await doDispatch(appContext, action);
            } finally {
                setActionRunning(false);
            }
        }

        return ({
            selection: {
                getSelection: () => selection,
                setSelection,
            },
            editor: {
                getDirty: () => dirty,
                getCurrentDoc: () => {
                    if (typeof currentContent === "string") {
                        throw new Error("Current doc is a string");
                    } else {
                        return currentContent;
                    }
                },
                getCurrentDocAsString: () => {
                    if (typeof currentContent === "string") {
                        return currentContent;
                    } else {
                        return JSON.stringify(currentContent, null, 2);
                    }
                },
                setCurrentDoc: setCurrentDoc,
                loadNewDoc: loadNewDoc,
                isAlreadyPublished: () => isAlreadyPublished,
            },
            github: {
                branch: params.branch || defaultGithubContext.branch,
                user,
                cache: swrConfig.cache,
            },
            dispatch,
            navigate,
            menuModal: menuRef,
            preview: {
                open: previewOpen,
                toggle: () => {
                    setPreviewOpen(!previewOpen);
                },
                mode: previewMode,
                toggleMode: () => {
                    setPreviewMode(previewMode === "modal" ? "panel" : "modal");
                },
            },
        });
    }, [setCurrentDoc, loadNewDoc, params.branch, user, swrConfig.cache, navigate, previewOpen, previewMode, selection, dirty, setSelection, currentContent, isAlreadyPublished]);
    const contextRef = useFixedRef(appContext);

    const keydown = useCallback((event: KeyboardEvent) => {
        if ((navigator.platform.indexOf("Mac") === 0 ? event.metaKey : event.ctrlKey) && event.key === "s") {
            event.preventDefault();
            event.stopPropagation();
            if (contextRef.current.editor.getDirty()) {
                contextRef.current.dispatch({type: "save"});
            }
        }
    }, [contextRef]);

    useEffect(() => {
        document.body.addEventListener("keydown", keydown);
        return () => document.body.removeEventListener("keydown", keydown);
    }, [keydown]);

    // Once a preview is opened, keep it around so we don't have to slowly reload the IFRAME.
    const previewEverOpen = useRef(false);
    previewEverOpen.current = previewEverOpen.current || previewOpen;
    const previewComponent = previewEverOpen.current ? <Preview /> : null;

    const hasFileOpen = selection && !selection.isDir;
    const showPreview = !!hasFileOpen && previewOpen;

    return <SWRConfig value={{fetcher, revalidateOnFocus: false, revalidateOnReconnect: false}}>
        <AppContext.Provider value={appContext}>
            <div className={styles.editorScreen}>
                <LeftMenu />
                {hasFileOpen ?
                    selection.path.endsWith(".json") ?
                        <SemanticEditor />
                        : <TextEditor />
                    :
                    <div className={styles.centered}>
                        Choose a file on the left to edit
                    </div>
                }
                {previewMode === "panel" && <div className={showPreview ? styles.flexFill : styles.displayNone}>
                    {previewComponent}
                </div>}
            </div>
            {previewMode === "modal" &&
                <Modal isOpen={showPreview} className={styles.previewModal} contentClassName={styles.previewModalContent}>
                    {previewComponent}
                </Modal>
            }
            <Modal isOpen={actionRunning} contentClassName={styles.actionsModalContent}>
                <div className={styles.centered}>
                    <Spinner size="lg" />
                    <h2>Processing...</h2>
                </div>
            </Modal>
            <MenuModal menuRef={menuRef} />
        </AppContext.Provider>
    </SWRConfig>;
}
