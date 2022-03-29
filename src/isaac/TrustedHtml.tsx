import React, { useContext } from "react";

import { FigureNumberingContext } from "./IsaacTypes";
import { katexify } from "./LaTeX";

export const TrustedHtml = ({html, span, className}: {html: string; span?: boolean; className?: string}) => {
    const booleanNotation = null;
    const screenReaderHoverText = true;

    const figureNumbers = useContext(FigureNumberingContext);

    html = katexify(html, booleanNotation, screenReaderHoverText, figureNumbers);

    const ElementType = span ? "span" : "div";
    return <ElementType className={className} dangerouslySetInnerHTML={{__html: html}} />;
};
