import React, { useState } from "react";
import { Button } from "reactstrap";

import { Box } from "./SemanticItem";
import { InsertButton, InserterProps } from "./ListChildrenPresenter";
import styles from "./inserter.module.css";

const blockTypes = {
    "Content": {type: "content", encoding: "markdown", value: ""},
    "Figure": {type: "figure", encoding: "markdown", value: ""},
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
