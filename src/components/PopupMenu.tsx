import React, {
    MutableRefObject,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Portal from "reactstrap/src/Portal";

import { AppContext } from "../App";

import { Entry } from "./FileBrowser";

import styles from "../styles/editor.module.css";
import { githubReplaceWithConfig } from "../services/github";
import { Content } from "../isaac-data-types";
import { StagingServer } from "../services/isaacApi";

type PopupEntry = Entry & {
    refresh?: () => void;
};

export interface PopupMenuRef {
    open: (event: React.MouseEvent, item: PopupEntry) => void;
}

type MenuItemProps =
    | {
        close: () => void;
        onClick: () => void;
        href?: never;
        text: string;
    }
    | {
        close: () => void;
        onClick?: never;
        href: string;
        text: string;
    }
;

function MenuItem({
                      onClick,
                      href,
                      text,
                      close
                  }: MenuItemProps) {
    return <li>
        <button onClick={() => {
            if (onClick) {
                onClick();
            } else {
                window.open(href, "_blank");
            }
            close();
        }}>{text}</button>
    </li>;
}

function getPreviewLink(doc: Content) {
    if (doc && doc.id) {
        switch (doc.type) {
        case "isaacConceptPage":
            return `${StagingServer}/concepts/${doc.id}`;
        case "isaacQuestionPage":
        case "isaacFastTrackQuestionPage":
            return `${StagingServer}/questions/${doc.id}`;
        case "isaacTopicSummaryPage":
            return `${StagingServer}/topics/${doc.id.slice("topic_summary_".length)}`;
        case "isaacEventPage":
            return `${StagingServer}/events/${doc.id}`;
        case "page":
            return `${StagingServer}/pages/${doc.id}`;
        case "isaacQuiz":
            return `${StagingServer}/quiz/preview/${doc.id}`;
        }
    }
}

export function PopupMenu({menuRef}: { menuRef: MutableRefObject<PopupMenuRef | null> }) {
    const [isOpen, setOpen] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0});
    const [item, setItem] = useState<PopupEntry>(undefined as unknown as PopupEntry);
    const insideRef = useRef<HTMLUListElement | null>(null);
    const appContext = useContext(AppContext);

    const handleContextMenu = useCallback((event, item) => {
        event.preventDefault();
        setAnchorPoint({x: event.pageX, y: event.pageY});
        if (event.pageY + (insideRef.current?.clientHeight ?? 0) > window.innerHeight) {
            setAnchorPoint({x: event.pageX, y: event.pageY - (insideRef.current?.clientHeight ?? 0)});
        }
        setOpen(true);
        setItem(item);
    }, [setAnchorPoint, setOpen]);

    const closeOutside = useCallback((event: MouseEvent) => {
        if (insideRef.current?.contains(event.target as Node)) {
            return;
        }
        setOpen(false);
        event.stopPropagation();
        event.preventDefault();
    }, []);
    useEffect(() => {
        if (isOpen) {
            if (anchorPoint.y + (insideRef.current?.clientHeight ?? 0) > window.innerHeight) {
                setAnchorPoint({x: anchorPoint.x, y: anchorPoint.y - (insideRef.current?.clientHeight ?? 0)});
            }
            document.addEventListener("click", closeOutside, {capture: true});
            return () => document.removeEventListener("click", closeOutside, {capture: true});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, closeOutside]);

    useImperativeHandle(menuRef, () => ({
        open: handleContextMenu,
    }), [handleContextMenu]);

    const close = useCallback(() => {
        setOpen(false);
    }, []);

    const isCurrentFile = item?.path === appContext.selection.getSelection()?.path;

    let previewLink;
    try {
        // Preview only for currently selected document
        if (isCurrentFile) {
            previewLink = getPreviewLink(appContext.editor.getCurrentDoc());
        }
    } catch {
        // No current doc so no preview
    }

    return isOpen ?
        <Portal>
            <ul
                className={styles.leftMenuPopupMenu}
                style={{
                    top: anchorPoint.y,
                    left: anchorPoint.x
                }}
                ref={insideRef}
            >
                {item.type === "dir" && <MenuItem close={close} onClick={() => appContext.dispatch({
                    type: "new",
                    path: item.path
                })} text="New..." />}
                <MenuItem close={close} onClick={() => appContext.dispatch({
                    type: "openInNewTab",
                    path: item.path
                })} text="Open in new tab" />
                {item.type === "dir" && item.refresh && <>
                    <hr />
                    <MenuItem close={close} onClick={() => item.refresh?.()} text="Refresh"/>
                </>}
                {item.type === "file" && isCurrentFile && <MenuItem close={close} onClick={() => appContext.dispatch({
                    type: "rename",
                    path: item.path,
                    name: item.name,
                    sha: item.sha,
                })} text="Rename..." />}
                {item.type === "file" && isCurrentFile && <MenuItem close={close} onClick={() => appContext.dispatch({
                    type: "saveAs",
                    path: item.path,
                    name: item.name,
                })} text="Save as..." />}
                {item.type === "file" && <MenuItem close={close} onClick={() => appContext.dispatch({
                    type: "delete",
                    path: item.path,
                    name: item.name,
                    sha: item.sha,
                })} text="Delete" />}
                {item.type === "file" && <hr />}
                {item.type === "file" && <MenuItem close={close} href={
                    `${githubReplaceWithConfig("https://github.com/$OWNER/$REPO/blob")}/${appContext.github.branch}/${item.path}`
                } text="View on github" />}
                {item.type === "file" && <MenuItem close={close} href={`${githubReplaceWithConfig("https://github.com/$OWNER/$REPO/issues/new")}?body=${encodeURIComponent(
                        `Issue found in ${item.path} by ${appContext.github.user.login}.\n\n<Describe issue here>`
                )}`} text="Report issue on github"/>}
                {item.type === "file" && previewLink && <MenuItem close={close} href={previewLink} text="Preview on staging" />}
            </ul>
        </Portal>
        : null;
}
