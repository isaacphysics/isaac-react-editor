import React, { useState } from "react";

import { Content } from "../../isaac-data-types";
import { Box, PresenterProps, SemanticItem } from "./SemanticItem";
import styles from "./styles.module.css";
import { Button } from "reactstrap";

type InserterProps = { insert: (newContent: Content) => void };

function Inserter({insert}: InserterProps) {
    const [isInserting, setInserting] = useState(false);
    return <div className={styles.inserter}>
        {!isInserting && <div className={styles.inserterAdd}><button onClick={() => setInserting(true)}>+</button></div>}
        {isInserting && <Box name="?" onDelete={() => setInserting(false)}>
            <Button color="link" onClick={() => {
                insert({type: "content", encoding: "markdown", value: "Empty..."});
                setInserting(false);
            }}>Content</Button>
        </Box>}
    </div>;
}

function deriveNewDoc(doc: Content) {
    return {
        ...doc,
        children: doc.children ? [...doc.children] : [],
    };
}

export function ListChildrenPresenter({doc, update}: PresenterProps) {
    // Iterate doc.children
    const result: JSX.Element[] = [];

    function addInserter(position: number) {
        result.push(<Inserter key={`__insert_${position}`} insert={(newContent) => {
            const newDoc = deriveNewDoc(doc);
            newDoc.children.splice(position, 0, newContent);
            update(newDoc);
        }} />);
    }

    doc.children?.forEach((child, index) => {
        addInserter(index);
        result.push(<SemanticItem key={child.id || `_child_${index}`} doc={child as Content} update={(newContent) => {
            const newDoc = deriveNewDoc(doc);
            newDoc.children[index] = newContent;
            update(newDoc);
        }}/>);
    });
    addInserter(doc.children?.length || 0);
    return <>
        {result}
    </>;
}
