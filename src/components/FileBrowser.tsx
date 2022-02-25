import React, { ComponentProps, FunctionComponent, useContext, useState } from "react";
import useSWR from "swr";
import { ListGroup, ListGroupItem } from "reactstrap";
import { AppContext } from "../App";

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
    initialOpen?: boolean
}

type FileItemProps = Exclude<ComponentProps<typeof ListGroupItem>, 'onClick'> & {
    path: string;
    onClick?: (isSelected: boolean) => void;
    isDir?: boolean;
};

const FileItem: FunctionComponent<FileItemProps> = (props) => {
    const {onClick: innerClick, path, isDir, ...rest} = props;
    const selectionContext = useContext(AppContext).selection;
    const isSelected = selectionContext.getSelection()?.path === path;
    const onClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
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
                          tag="button"
                          color={isSelected ? 'info' : undefined}
                          style={{paddingRight: 0}}
                          onClick={onClick} {...rest} />;
};

function isOnSelectionPath(selectionContext: SelectedContext, at: string) {
    const selection = selectionContext.getSelection();
    return selection && `${selection.path}/`.substring(0, at.length + 1) === `${at}/`;
}

function Files({at, name, initialOpen}: FilesProps) {
    const selectionContext = useContext(AppContext).selection;
    const [open, setOpen] = useState(!!initialOpen || isOnSelectionPath(selectionContext, at));

    const {data, error, mutate} = useSWR(open ? `repos/$OWNER/$REPO/contents/${at}` : null);

    if (!open) {
        return <FileItem isDir path={at} onClick={() => setOpen(true)}>
            + {name}
        </FileItem>;
    }

    const content = error ? <div><em>Error loading data, {error}</em></div> : data ?
        <ListGroup flush>
            {data.map((entry: Entry) => {
                switch (entry.type) {
                    case "dir":
                        return <Files key={entry.name} at={entry.path} name={entry.name}/>;
                    case "file":
                        return <FileItem key={entry.name} path={entry.path}>🗎 {entry.name}</FileItem>
                    default:
                        return null;
                }
            })}
        </ListGroup> : <div>Loading...</div>;

    if (name) {
        return <FileItem isDir path={at} onClick={(isSelected) => {
            if (isSelected) {
                setOpen(false);
            }
        }}>
            - {name} <button onClick={(event) => {
            mutate();
            event.stopPropagation();
            event.preventDefault();
        }}>Refresh</button>
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
    return <div style={{overflowY: "auto"}}>
        <Files at="" initialOpen={true}/>
    </div>;
}
