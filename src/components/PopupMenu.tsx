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

type PopupEntry = Entry & {
    refresh?: () => void;
};

export interface PopupMenuRef {
    open: (event: React.MouseEvent, item: PopupEntry) => void;
}

function MenuItem({
                      onClick,
                      text,
                      close
                  }: { onClick: () => void; text: string; close: () => void; }) {
    return <li>
        <button onClick={() => {
            onClick();
            close();
        }}>{text}</button>
    </li>;
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
                })} text="New..."/>}
                <MenuItem close={close} onClick={() => appContext.dispatch({
                    type: "openInNewTab",
                    path: item.path
                })} text="Open in new tab"/>
                {item.type === "dir" && <hr/>}
                {item.type === "dir" && item.refresh &&
                    <MenuItem close={close} onClick={() => item.refresh?.()} text="Refresh"/>}
                {item.type === "file" && <MenuItem close={close} onClick={() => appContext.dispatch({
                    type: "rename",
                    path: item.path,
                    name: item.name,
                    sha: item.sha,
                })} text="Rename..."/>}
                {item.type === "file" && <MenuItem close={close} onClick={() => appContext.dispatch({
                    type: "saveAs",
                    path: item.path,
                    name: item.name,
                })} text="Save as..."/>}
                {item.type === "file" && <MenuItem close={close} onClick={() => appContext.dispatch({
                    type: "delete",
                    path: item.path,
                    name: item.name,
                    sha: item.sha,
                })} text="Delete"/>}
            </ul>
        </Portal>
        : null;
}
