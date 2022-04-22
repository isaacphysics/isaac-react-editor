import React, {
    ComponentProps,
    FunctionComponent,
    MutableRefObject,
    useContext,
    useRef,
    useState
} from "react";
import useSWR from "swr";
import { ListGroup, ListGroupItem, Spinner, } from "reactstrap";

import { AppContext } from "../App";
import styles from "../styles/editor.module.css";
import { PopupMenu, PopupMenuRef } from "./PopupMenu";

export type Entry = {
    type: "file";
    name: string;
    path: string;
    sha: string;
} | {
    type: "dir";
    name: string;
    path: string;
    sha: string;
};

interface FilesProps {
    entry?: Entry;
    menuRef: MutableRefObject<PopupMenuRef | null>;
}

type FileItemProps = Omit<ComponentProps<typeof ListGroupItem>, "onClick"> & {
    path: string;
    onClick?: (isSelected: boolean) => void;
    isDir?: boolean;
};

export function pathToId(path: string) {
    return `fileItem-${path.replaceAll(/[^a-zA-Z0-9-_]/g, "-")}`;
}

const FileItem: FunctionComponent<FileItemProps> = (props) => {
    const {onClick: innerClick, path, isDir, className, ...rest} = props;
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
                          className={`${className ?? ""} ${styles.fileBrowserItem} ${isSelected ? styles.fileBrowserItemSelected : ""}`}
                          onClick={onClick}
                          {...rest} />;
};

function isOnSelectionPath(selectionContext: SelectedContext, at: string) {
    const selection = selectionContext.getSelection();
    return at === "" || (selection && `${selection.path}/`.substring(0, at.length + 1) === `${at}/`);
}

function Files({entry, menuRef}: FilesProps) {
    const selectionContext = useContext(AppContext).selection;
    const at = entry?.path ?? ""
    const [open, setOpen] = useState(isOnSelectionPath(selectionContext, at));

    const {data, error, mutate} = useSWR(open ? `repos/$OWNER/$REPO/contents/${at}` : null);

    const content =
          !open ? null
        : error ? <div className={styles.fileBrowserList}><em>Error loading data, {error}</em></div>
        : data ?
            <ListGroup flush className={styles.fileBrowserList}>
                {data.map((entry: Entry) => {
                    switch (entry.type) {
                        case "dir":
                            return <Files key={entry.name} entry={entry} menuRef={menuRef}/>;
                        case "file":
                            // eslint-disable-next-line no-case-declarations
                            const fileOnContextMenu = (event: React.MouseEvent) => {
                                menuRef.current?.open(event, entry);
                                event.stopPropagation();
                                event.preventDefault();
                            };
                            return <FileItem key={entry.name} path={entry.path} name={entry.name} onContextMenu={fileOnContextMenu}>
                                {entry.name}
                            </FileItem>
                        default:
                            return null;
                    }
                })}
            </ListGroup>
        : <div className={styles.fileBrowserList}><Spinner size="sm" /> Loading...</div>;

    if (!entry) {
        return content;
    }

    const onContextMenu = (event: React.MouseEvent) => {
        menuRef.current?.open(event, {...entry, refresh: open ? mutate : undefined});
        event.stopPropagation();
        event.preventDefault();
    };

    const onClick = (isSelected: boolean) => {
        if (open) {
            if (isSelected) {
                setOpen(false);
            }
        } else {
            setOpen(true);
        }
    };

    return <FileItem className={open ? styles.fileBrowserOpenFolder : styles.fileBrowserClosedFolder}
                     isDir
                     path={at}
                     onClick={onClick}
                     onContextMenu={onContextMenu}
    >
        {entry.name}
        {content}
    </FileItem>;
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

export function FileBrowser() {
    const menuRef = useRef<PopupMenuRef>(null);
    return <div className={styles.fileBrowser}>
        <Files menuRef={menuRef} />
        <PopupMenu menuRef={menuRef} />
    </div>;
}
