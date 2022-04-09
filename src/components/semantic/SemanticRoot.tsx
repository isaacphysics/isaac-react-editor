import React from "react";
import { SWRConfig } from "swr";

import { Content } from "../../isaac-data-types";
import { FigureNumberingContext } from "../../isaac/IsaacTypes";
import { useFigureNumbering } from "../../isaac/WithFigureNumbering";
import { SITE } from "../../services/site";

import { SemanticItem } from "./SemanticItem";
import styles from "./styles/semantic.module.css";

interface SemanticRootProps {
    doc: Content;
    update: (newContent: Content) => void;
}

const StagingServer = {
    "PHY": "https://staging.isaacphysics.org",
    "CS": "https://staging.isaaccomputerscience.org",
}[SITE];

async function fetcher(path: string, options?: RequestInit) {
    const fullPath = `${StagingServer}/api/any/api/${path}`;

    const fullOptions: RequestInit = {
        ...options,
        mode: "cors",
    };
    const result = await fetch(fullPath, fullOptions);
    return result.json();
}

export function SemanticRoot({doc, update}: SemanticRootProps) {
    const figureNumbers = useFigureNumbering(doc);

    return <FigureNumberingContext.Provider value={figureNumbers}>
        <SWRConfig value={{fetcher}}>
            <div className={styles.outerWrapper}>
                <SemanticItem doc={doc} update={update} />
            </div>
        </SWRConfig>
    </FigureNumberingContext.Provider>;
}
