/* eslint-disable react/prop-types */
import React, {
    forwardRef,
    useCallback,
    useEffect, useImperativeHandle,
    useMemo,
    useReducer,
    useRef,
    useState
} from "react";
import { Button, Input } from "reactstrap";

export interface SaveOptions {
    movement?: number;
    fromBlur?: boolean;
}

export type EditableTextProps = {
    text?: string;
    onSave: (newText: string | undefined, options?: SaveOptions) => void;
    multiLine?: boolean;
    placeHolder?: string;
    onDelete?: (options?: SaveOptions) => void;
    autoFocus?: boolean;
    hasError?: (newText: string | undefined) => string | undefined;
    label?: string;
    noSupressSaves?: boolean;
    hideWhenEmpty?: boolean;
};

export const escapedNewLineToLineBreakTag = (string: string) => string.split('\n').map((item: string, index: number) => (index === 0) ? item : [<br key={index}/>, item])

type EditableTextState = { isEditing: boolean; value?: string };

type EditableTextAction =
    | { type: "startEdit" }
    | { type: "save"; options?: SaveOptions }
    | { type: "cancel" }
    | { type: "update"; value: string }
    ;


function useWrappedRef<T>(t: T) {
    const ref = useRef<T>(t);
    useEffect(() => {
        ref.current = t;
    }, [t]);
    return ref;
}

export interface EditableTextRef {
    startEdit: () => void;
}

export const EditableText = forwardRef<EditableTextRef, EditableTextProps>(({
                                 text,
                                 onSave: onSaveUnsafe,
                                 multiLine,
                                 placeHolder,
                                 onDelete: onDeleteUnsafe,
                                 autoFocus,
                                 hasError: hasErrorUnsafe,
                                 label,
                                 noSupressSaves,
                                 hideWhenEmpty,
                             }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>();

    const onSave = useWrappedRef(onSaveUnsafe);
    const onDelete = useWrappedRef(onDeleteUnsafe);
    const hasError = useWrappedRef(hasErrorUnsafe);

    const reducer = useMemo(() => {
        return (current: EditableTextState, action: EditableTextAction) => {
            switch (action.type) {
                case 'startEdit':
                    if (current.isEditing) {
                        return current;
                    }
                    return {
                        isEditing: true,
                        value: text,
                    };
                case 'save':
                    if (current.isEditing) {
                        if (current.value === undefined || current.value === "") {
                            if (onDelete.current) {
                                onDelete.current(action.options);
                            } else {
                                if (hasError.current && !!hasError.current(current.value)) {
                                    alert("Not a valid value")
                                    return current;
                                } else if (placeHolder) {
                                    onSave.current(undefined, action.options);
                                } else {
                                    if (text !== undefined) {
                                        // Not empty to start with
                                        alert("Cannot be empty.");
                                    }
                                    return current;
                                }
                            }
                        } else {
                            if (hasError.current && !!hasError.current(current.value)) {
                                alert("Not a valid value");
                                return current;
                            }
                            if (noSupressSaves || current.value !== text) {
                                // No changes, no save
                                onSave.current(current.value, action.options);
                            }
                        }
                    }
                    return {isEditing: false};
                case 'cancel':
                    return {isEditing: false};
                case 'update':
                    return {...current, value: action.value};
            }
        };
    }, [text, onDelete, hasError, placeHolder, onSave, noSupressSaves]);
    const [state, dispatch] = useReducer(reducer, {isEditing: false});

    useEffect(() => {
        if (autoFocus === true) {
            dispatch({type: 'startEdit'});
        }
    }, [autoFocus]);

    const startEdit = useCallback(() => dispatch({type: 'startEdit'}), []);
    const save = useCallback((options?: SaveOptions) => dispatch({type: 'save', options}), []);
    const cancel = useCallback(() => dispatch({type: 'cancel'}), []);
    const setCurrent = useCallback((value: string) => {
        dispatch({type: 'update', value});
        if (hasError.current) {
            setErrorMessage(hasError.current(value));
        }
    }, [hasError]);

    const handleKey = (e: React.KeyboardEvent) => {
        if ((!multiLine || e.ctrlKey || e.metaKey) && e.key === "Enter") {
            save({movement: 1});
        } else if (e.key === "Escape") {
            cancel();
        } else if (!multiLine && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
            save({movement: e.key === "ArrowUp" ? -1 : 1});
        }
    };

    const onBlur = (e: React.FocusEvent) => {
        if (wrapperRef.current && wrapperRef.current.contains(e.relatedTarget as Element)) {
            // Inside, so ignore
        } else {
            save({fromBlur: true});
        }
    };

    useImperativeHandle(ref, () => ({
        startEdit: () => {
            dispatch({type: 'startEdit'});
        },
    }));

    const nonEmpty = text !== undefined && text !== "";
    const selected = state.isEditing || nonEmpty;

    const hidden = hideWhenEmpty && !selected;
    if (hidden) {
        return null;
    }

    const labelElement = label && <>{selected ?
        <em>{label}:</em> : label}</>;
    return state.isEditing ?
        <span ref={wrapperRef}>
            {labelElement}
            {multiLine ?
                <Input type="textarea"
                       /* eslint-disable-next-line jsx-a11y/no-autofocus */
                       autoFocus
                       value={state.value}
                       onChange={e => setCurrent(e.target.value)}
                       onKeyDown={handleKey}
                       placeholder={placeHolder}
                       onBlur={onBlur}/>
                :
                <Input type="text"
                       /* eslint-disable-next-line jsx-a11y/no-autofocus */
                       autoFocus
                       value={state.value}
                       onChange={e => setCurrent(e.target.value)}
                       onKeyDown={handleKey}
                       placeholder={placeHolder}
                       onBlur={onBlur}
                       invalid={!!errorMessage}
                />
            }
            {errorMessage && <b>{errorMessage}</b>}
            <Button onClick={cancel}>Cancel</Button>
            <Button onClick={() => save()}>Save</Button>
        </span>
        : multiLine ?
            <span>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <span onClick={startEdit}>
                    {labelElement}
                    {text === undefined ? <i>{placeHolder}</i> : escapedNewLineToLineBreakTag(text)}
                </span>
            </span>
            :
            /* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
            <span onClick={startEdit}>
                {labelElement}
                {text === undefined ?
                    <i>{placeHolder}</i> : text}
                {onDelete.current && <Button onClick={() => onDelete.current && onDelete.current()}>Delete</Button>}
            </span>;
});

EditableText.displayName = "EditableText";
