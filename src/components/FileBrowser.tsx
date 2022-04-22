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
        return <FileItem className={styles.fileBrowserClosedFolder} isDir path={at} onClick={() => setOpen(true)} onContextMenu={onContextMenu}>
            {name}
        </FileItem>;
    }

    const content = error ? <div className={styles.fileBrowserList}><em>Error loading data, {error}</em></div> : data ?
        <ListGroup flush className={styles.fileBrowserList}>
            {data.map((entry: Entry) => {
                switch (entry.type) {
                    case "dir":
                        return <Files key={entry.name} at={entry.path} name={entry.name} menuRef={menuRef}/>;
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
        </ListGroup> : <div className={styles.fileBrowserList}><Spinner size="sm" /> Loading...</div>;

    if (name) {
        return <FileItem className={styles.fileBrowserOpenFolder}  isDir path={at} onClick={(isSelected) => {
            if (isSelected) {
                setOpen(false);
            }
        }} onContextMenu={onContextMenu}>
            {name}
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

export function FileBrowser() {
    const menuRef = useRef<PopupMenuRef>(null);
    return <div className={styles.fileBrowser}>
        <Files at="" initialOpen={true} menuRef={menuRef} />
        <PopupMenu menuRef={menuRef} />
    </div>;
}
