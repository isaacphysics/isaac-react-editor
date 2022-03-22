import React from "react";

import { SemanticItem } from "./SemanticItem";
import { Content } from "../../isaac-data-types";

interface SemanticRootProps {
    doc: Content;
    update: (newContent: Content) => void;
}

export function SemanticRoot({doc, update}: SemanticRootProps) {
    return <SemanticItem doc={doc} update={update} />;
}
