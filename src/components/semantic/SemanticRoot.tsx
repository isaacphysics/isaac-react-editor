import React from "react";

import { SemanticItem } from "./SemanticItem";
import { Content } from "../../isaac-data-types";
import { FigureNumberingContext } from "../../isaac/IsaacTypes";
import { WithFigureNumbering } from "../../isaac/WithFigureNumbering";

interface SemanticRootProps {
    doc: Content;
    update: (newContent: Content) => void;
}

export function SemanticRoot({doc, update}: SemanticRootProps) {
    return <FigureNumberingContext.Provider value={{}}>
        <WithFigureNumbering doc={doc}>
            <SemanticItem doc={doc} update={update} />
        </WithFigureNumbering>
    </FigureNumberingContext.Provider>;
}
