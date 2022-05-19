import { createContext } from "react";

export interface BooleanNotation {
    ENG?: boolean;
    MATH?: boolean;
}

export interface FigureNumbersById {[figureId: string]: number}
export const FigureNumberingContext = createContext<FigureNumbersById>({});
