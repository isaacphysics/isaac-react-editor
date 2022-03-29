/* eslint-disable react/prop-types */
import React, {
    forwardRef,
    FunctionComponent,
    useCallback,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import { Remarkable } from "remarkable";
import { linkify } from "remarkable/linkify";
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { html } from '@codemirror/lang-html';
import { Button } from "reactstrap";

import { PresenterProps } from "./SemanticItem";
import styles from "./value.module.css";
import { Content } from "../../isaac-data-types";

const converter = new Remarkable({
    html: true,
}).use(linkify);

export interface ValuePresenterRef {
    startEdit: () => void;
}
export type ValuePresenter<D extends Content = Content> = React.ForwardRefExoticComponent<React.PropsWithoutRef<PresenterProps<D>> & React.RefAttributes<ValuePresenterRef>>;

// TODO: It feels like the type-system could enforce that value should only be read when editing is true
export interface ValuePresenterProps<V, D extends Content = Content> {
    doc: D;
    value: React.MutableRefObject<V | undefined>;
    editing: boolean;
}

export function buildValuePresenter<V, D extends Content = Content>(
    Component: FunctionComponent<ValuePresenterProps<V, D>>,
    init: (doc: D) => V,
    save: (value: V, doc: D) => D,
) {
    const vp = forwardRef<ValuePresenterRef, PresenterProps<D>>(({doc, update}, ref) => {
        const [editing, setEditing] = useState(false);
        const value = useRef<V>();
        const startEdit = useCallback(() => {
            setEditing((currently) => {
                if (!currently) {
                    value.current = init(doc);
                } else {
                    console.log("Already editing");
                }
                return true;
            });
        }, [doc]);

        useImperativeHandle(ref, () => ({
            startEdit: () => {
                startEdit();
            }
        }), [startEdit]);
        const component = <Component editing={editing} doc={doc} value={value} />;
        if (!editing) {
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
            return <div onClick={() => startEdit()}>
                {component}
            </div>;
        } else {
            return <>
                {component}
                <div className={styles.editButtons}>
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        setEditing(false);
                    }}>Cancel</Button>
                    <Button color="primary" onClick={(e) => {
                        e.stopPropagation();
                        setEditing(false);
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        update(save(value.current!, doc));
                    }}>Save</Button>
                </div>
            </>;
        }
    });
    vp.displayName = Component.displayName;
    return vp;
}

const BaseValue = ({doc, editing, value}: ValuePresenterProps<string | undefined>) => {
    if (!editing) {
        if (!doc.value) {
            return <p>
                <em>Enter content here</em>
            </p>;
        }
        switch (doc.encoding) {
            case "html":
                return <div dangerouslySetInnerHTML={{__html: doc.value || ""}}/>;
            case "markdown":
                return <div dangerouslySetInnerHTML={{__html: converter.render(doc.value || "")}}/>;
            case "plain":
                return <div>{value}</div>;
            default:
                return <div>{`<${doc.encoding}> ${value}`}</div>;
        }
    } else {
        const encoding = doc.encoding === "markdown" ? [markdown()]
            : doc.encoding === "html" ? [html()]
            : [];
        return <CodeMirror
                value={value.current}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                extensions={[...encoding, EditorView.lineWrapping]}
                onChange={(newValue) => {
                    value.current = newValue;
                }}
            />;
    }
};

export const BaseValuePresenter = buildValuePresenter(
    BaseValue,
    (doc) => doc.value,
    (value, doc) => ({...doc, value}),
);


export type ValueRef = React.MutableRefObject<ValuePresenterRef | null>;

export interface ValueWrapperProps {
    valueRef?: ValueRef;
    className?: string;
}

export const ValueWrapper: FunctionComponent<ValueWrapperProps> = ({
    className,
    valueRef,
    children
}) => {
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    return <div role="cell" className={className} onClick={valueRef && ((e) => {
        // Only catch clicks that are outside any other element
        // FIXME: This misses clicks in the header, and also takes clicks in odd places like padding and empty spaces of an item.
        if (e.target === e.currentTarget) {
            valueRef.current?.startEdit();
        }
    })}>
        {children}
    </div>;
};
