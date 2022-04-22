import React, {
    ComponentProps,
    FunctionComponent,
    MutableRefObject,
    useCallback,
    useContext, useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import useSWR from "swr";
import {
    ListGroup,
    ListGroupItem, Spinner,
} from "reactstrap";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Portal from "reactstrap/src/Portal";

import { AppContext } from "../App";
import styles from "../styles/editor.module.css";

type Entry = {
    type: "file";
    name: string;
    path: string;
} | {
    type: "dir";
    name: string;
    path: string;
};

interface FilesProps {
    at: string;
    name?: string;
    initialOpen?: boolean;
    menuRef: MutableRefObject<PopupMenuRef | null>;
}

type FileItemProps = Exclude<ComponentProps<typeof ListGroupItem>, 'onClick'> & {
    path: string;
    onClick?: (isSelected: boolean) => void;
    isDir?: boolean;
};

export function pathToId(path: string) {
    return `fileItem-${path.replaceAll(/[^a-zA-Z0-9-_]/g, "-")}`;
}

const FileItem: FunctionComponent<FileItemProps> = (props) => {
    const {onClick: innerClick, path, isDir, ...rest} = props;
    const selectionContext = useContext(AppContext).selection;
    const isSelected = selectionContext.getSelection()?.path === path;

    const onClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!isSelected) {
            if (!selectionContext.setSelection({path, isDir: !!isDir})) {
                return;
            }
        }
        if (innerClick) {
            innerClick(isSelected);
        }
    }
    return <ListGroupItem action
                          id={pathToId(path)}
                          tag="button"
                          className={`${styles.fileBrowserItem} ${isSelected ? styles.fileBrowserItemSelected : ""}`}
                          onClick={onClick}
                          {...rest} />;
};

function isOnSelectionPath(selectionContext: SelectedContext, at: string) {
    const selection = selectionContext.getSelection();
    return selection && `${selection.path}/`.substring(0, at.length + 1) === `${at}/`;
}

function Files({at, name, initialOpen, menuRef}: FilesProps) {
    const selectionContext = useContext(AppContext).selection;
    const [open, setOpen] = useState(!!initialOpen || isOnSelectionPath(selectionContext, at));

    const {data, error, mutate} = useSWR(open ? `repos/$OWNER/$REPO/contents/${at}` : null);

    const onContextMenu = (event: React.MouseEvent) => {
        menuRef.current?.open(event, {type: "dir", path: at, name: name as string, refresh: open ? mutate : undefined});
        event.stopPropagation();
        event.preventDefault();
    };

    if (!open) {
        return <FileItem isDir path={at} onClick={() => setOpen(true)} onContextMenu={onContextMenu} menuRef={menuRef}>
            +&nbsp;{name}
        </FileItem>;
    }

    const content = error ? <div><em>Error loading data, {error}</em></div> : data ?
        <ListGroup flush className={styles.fileBrowserList}>
            {data.map((entry: Entry) => {
                switch (entry.type) {
                    case "dir":
                        return <Files key={entry.name} at={entry.path} name={entry.name} menuRef={menuRef}/>;
                    case "file":
                        // eslint-disable-next-line no-case-declarations
                        const fileOnContextMenu = (event: React.MouseEvent) => {
                            menuRef.current?.open(event, {type: "file", path: at, name: name as string});
                            event.stopPropagation();
                            event.preventDefault();
                        };
                        return <FileItem key={entry.name} path={entry.path} name={entry.name} onContextMenu={fileOnContextMenu}>
                            🗎&nbsp;{entry.name}
                        </FileItem>
                    default:
                        return null;
                }
            })}
        </ListGroup> : <div><Spinner size="sm" /> Loading...</div>;

    if (name) {
        return <FileItem isDir path={at} onClick={(isSelected) => {
            if (isSelected) {
                setOpen(false);
            }
        }} menuRef={menuRef} onContextMenu={onContextMenu}>
            -&nbsp;{name}
            {content}
        </FileItem>;
    } else {
        return content;
    }
}

export type Selection = {
    path: string;
    isDir: boolean;
} | null;
export type SelectedContext = {
    getSelection: () => Selection;
    setSelection: (selection: Selection) => boolean;
}
export const defaultSelectedContext: SelectedContext = {getSelection: () => null, setSelection: () => {
    throw new Error("setSelected called outside of Provider");
}};

type PopupEntry = Entry & {
    refresh?: () => void;
};

interface PopupMenuRef {
    open: (event: React.MouseEvent, item: PopupEntry) => void;
}

function MenuItem({onClick, text, close}: { onClick: () => void; text: string; close: () => void; }) {
    return <li>
        <button onClick={() => {
            onClick();
            close();
        }}>{text}</button>
    </li>;
}

function PopupMenu({menuRef}: {menuRef: MutableRefObject<PopupMenuRef | null>}) {
    const [isOpen, setOpen] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [item, setItem] = useState<PopupEntry>(undefined as unknown as PopupEntry);
    const insideRef = useRef<HTMLUListElement | null>(null);

    const handleContextMenu = useCallback((event, item) => {
        event.preventDefault();
        setAnchorPoint({ x: event.pageX, y: event.pageY });
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
            document.addEventListener("click", closeOutside, {capture: true});
            return () => document.removeEventListener("click", closeOutside, {capture: true});
        }
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
                {item.type === "dir" && <MenuItem close={close} onClick={() => item.refresh?.()} text="New"/>}
                {item.type === "dir" && item.refresh && <MenuItem close={close} onClick={() => item.refresh?.()} text="Refresh"/>}
                {item.type === "file" && <MenuItem close={close} onClick={() => 0} text="Save as..."/>}
                {item.type === "file" && <MenuItem close={close} onClick={() => 0} text="Delete"/>}
            </ul>
        </Portal>
    : null;
}

export function FileBrowser() {
    const menuRef = useRef<PopupMenuRef>(null);
    return <div className={styles.fileBrowser}>
        <Files at="" initialOpen={true} menuRef={menuRef} />
        <PopupMenu menuRef={menuRef} />
    </div>;
}
