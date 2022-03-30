import React, { FunctionComponent, useRef, useState } from "react";

import styles from "./styles.module.css";

import { ValuePresenterRef, ValueRef, ValueWrapper } from "./BaseValuePresenter";
import { Content } from "../../isaac-data-types";
import { getEntryType } from "./registry";

export interface Shift {
    up: boolean;
    down: boolean;
    by: (amount: number) => void;
}
export interface SemanticItemProps {
    doc: Content;
    update: (newContent: Content) => void;
    onDelete?: () => void;
    name?: string;
    className?: string;
    shift?: Shift;
}

interface BoxProps {
    name?: string | undefined;
    onDelete?: () => void;
    className?: string;
    valueRef?: ValueRef;
    shift?: Shift;
}

export const Box: FunctionComponent<BoxProps> = ({name, onDelete, shift, className, valueRef, children}) => {
    const [deleteHovered, setDeleteHovered] = useState(false);
    return <ValueWrapper className={`${styles.box} ${className ?? ""} ${deleteHovered ? styles.boxDeleteHovered : ""}`} valueRef={valueRef}>
        <div className={styles.boxHeader}>
            {name && <span className={styles.boxLabel}>{name}</span>}
            <span className={styles.boxSpacer}/>
            {shift && shift.up && <button className={styles.boxUp}
                                          onClick={() => shift?.by(-1)}>
                ▲
            </button>}
            {shift && shift.down && <button className={styles.boxDown}
                                            onClick={() => shift?.by(1)}>
                    ▼
            </button>}
            {onDelete && <button className={styles.boxDelete}
                                 onMouseOver={() => setDeleteHovered(true)}
                                 onMouseOut={() => setDeleteHovered(false)}
                                 onFocus={() => setDeleteHovered(true)}
                                 onBlur={() => setDeleteHovered(false)}
                                 onClick={onDelete}>
                ❌
            </button>}
        </div>
        {children}
    </ValueWrapper>;
};


export function SemanticItem(props: SemanticItemProps) {
    const {doc, update, name, ...rest} = props;
    const valueRef = useRef<ValuePresenterRef>(null);
    const entryType = getEntryType(doc);

    const MetadataPresenter = entryType.headerPresenter;
    const metadata = MetadataPresenter ? <MetadataPresenter doc={doc} update={update} /> : null;

    const BodyPresenter = entryType.bodyPresenter;
    const body = BodyPresenter ? <BodyPresenter doc={doc} update={update} valueRef={valueRef} /> : null;

    const AdditionalPresenter = entryType.footerPresenter;
    const additional = AdditionalPresenter ? <AdditionalPresenter doc={doc} update={update} /> : null;

    // Render outline with type name
    return <Box name={name || entryType.name} {...rest} valueRef={valueRef}>
        {metadata}
        {body}
        {additional}
    </Box>;
}
