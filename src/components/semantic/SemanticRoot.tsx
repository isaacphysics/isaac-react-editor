import React from "react";

import { Content } from "../../isaac-data-types";
import { FigureNumberingContext } from "../../isaac/IsaacTypes";
import { WithFigureNumbering } from "../../isaac/WithFigureNumbering";

import { SemanticItem } from "./SemanticItem";
import styles from "./styles.module.css";

interface SemanticRootProps {
    doc: Content;
    update: (newContent: Content) => void;
}

export function SemanticRoot({doc, update}: SemanticRootProps) {
    return <FigureNumberingContext.Provider value={{}}>
        <WithFigureNumbering doc={doc}>
            <div className={styles.outerWrapper}>
                <SemanticItem doc={doc} update={update} />
            </div>
        </WithFigureNumbering>
    </FigureNumberingContext.Provider>;
}
