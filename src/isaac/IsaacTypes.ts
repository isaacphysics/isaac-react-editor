import { createContext } from "react";

export interface BooleanNotation {
    ENG?: boolean;
    MATH?: boolean;
}

export const NON_STATIC_FIGURE_FLAG = "NON_STATIC_FIGURE";
export interface FigureNumbersById {[figureId: string]: number | typeof NON_STATIC_FIGURE_FLAG | undefined}
export const FigureNumberingContext = createContext<FigureNumbersById>({});
