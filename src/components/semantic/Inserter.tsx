import React, { useState } from "react";
import { Button } from "reactstrap";

import { Box } from "./SemanticItem";
import { generate, InsertButton, InserterProps } from "./ListChildrenPresenter";
import styles from "./inserter.module.css";

const blockTypes = {
    "content": {type: "content", encoding: "markdown", value: ""},
    "code snippet": {
        type: "codeSnippet",
        language: "pseudocode",
        code: "",
        disableHighlighting: false,
    },
    "question": {type: "isaacQuestion", encoding: "markdown", value: "", id: generate, 	answer: {
        "type": "content",
        "value": "",
        "encoding": "markdown"
    }},
    "glossary term": {type: "glossaryTerm", encoding: "markdown", value: ""},
    "figure": {type: "figure", encoding: "markdown", value: ""},
    "video": {type: "video", encoding: "markdown", src: "https://www.youtube.com/watch?v=<video_id>"},
    "tabs": {type: "content", layout: "tabs", encoding: "markdown", children: []},
    "accordion": {type: "content", layout: "accordion", encoding: "markdown", children: []},
};

export function Inserter({insert, forceOpen}: InserterProps) {
    const [isInserting, setInserting] = useState(false);

    const isOpen = forceOpen || isInserting;
    return isOpen ?
        <Box name="?" onDelete={forceOpen ? undefined : () => setInserting(false)}>
            <div className={styles.wrapper}>
                Please choose a block type:
                <br />
                {Object.entries(blockTypes).map(([name, empty]) =>
                    <Button key={name} color="link" onClick={() => {
                        insert({...empty});
                        setInserting(false);
                    }}>{name}</Button>
                )}
            </div>
        </Box>
        :
        <InsertButton onClick={() => setInserting(true)}/>;
}
