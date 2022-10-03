import { createContext } from "react";
import {Item} from "../isaac-data-types";

export interface BooleanNotation {
    ENG?: boolean;
    MATH?: boolean;
}

export const NON_STATIC_FIGURE_FLAG = "NON_STATIC_FIGURE";
export interface FigureNumbersById {[figureId: string]: number | typeof NON_STATIC_FIGURE_FLAG | undefined}
export const FigureNumberingContext = createContext<FigureNumbersById>({});

export const NULL_CLOZE_ITEM_ID = "NULL_CLOZE_ITEM" as const;
export const NULL_CLOZE_ITEM: Item = {
    type: "item",
    id: NULL_CLOZE_ITEM_ID
};
