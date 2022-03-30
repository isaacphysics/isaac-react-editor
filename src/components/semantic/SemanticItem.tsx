import React, { FunctionComponent, useRef, useState } from "react";

import styles from "./styles.module.css";

import { ValuePresenterRef, ValueRef, ValueWrapper } from "./BaseValuePresenter";
import { Content } from "../../isaac-data-types";
import { getEntryType } from "./registry";

export interface SemanticItemProps {
    doc: Content;
    update: (newContent: Content) => void;
    onDelete?: () => void;
    name?: string;
    className?: string;
}

interface BoxProps {
    name?: string | undefined;
    onDelete?: () => void;
    className?: string;
    valueRef?: ValueRef;
}

export const Box: FunctionComponent<BoxProps> = ({name, onDelete, className, valueRef, children}) => {
    const [deleteHovered, setDeleteHovered] = useState(false);
    return <ValueWrapper className={`${styles.box} ${className ?? ""} ${deleteHovered ? styles.boxDeleteHovered : ""}`} valueRef={valueRef}>
        <div className={styles.boxHeader}>
            {name && <span className={styles.boxLabel}>{name}</span>}
            <span className={styles.boxSpacer}/>
            {onDelete && <button className={styles.boxDelete}
                                 onMouseOver={() => setDeleteHovered(true)}
                                 onMouseOut={() => setDeleteHovered(false)}
                                 onFocus={() => setDeleteHovered(true)}
                                 onBlur={() => setDeleteHovered(false)}
                                 onClick={onDelete}>
                ❌</button>}
        </div>
        {children}
    </ValueWrapper>;
};


export function SemanticItem({doc, update, onDelete, name, className}: SemanticItemProps) {
    const valueRef = useRef<ValuePresenterRef>(null);
    const entryType = getEntryType(doc);

    const MetadataPresenter = entryType.headerPresenter;
    const metadata = MetadataPresenter ? <MetadataPresenter doc={doc} update={update} /> : null;

    const BodyPresenter = entryType.bodyPresenter;
    const body = BodyPresenter ? <BodyPresenter doc={doc} update={update} valueRef={valueRef} /> : null;

    const AdditionalPresenter = entryType.footerPresenter;
    const additional = AdditionalPresenter ? <AdditionalPresenter doc={doc} update={update} /> : null;

    // Render outline with type name
    return <Box name={name || entryType.name} onDelete={onDelete} className={className} valueRef={valueRef}>
        {metadata}
        {body}
        {additional}
    </Box>;
}
