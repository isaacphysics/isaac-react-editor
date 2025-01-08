import {Content, Figure} from "../isaac-data-types";
import { isDefined } from "./types";

export const extractValueOrChildrenText = (doc: Content): string => {
    return (doc.value || doc.children?.map(extractValueOrChildrenText).join("\n")) ?? "";
};

export const extractIndexedFigureDropZones = (doc: Content): number[] => {
    return (doc.type === "figure" ? (doc as Figure).dropZones?.map(dz => dz.index).filter(isDefined) : doc.children?.map(extractIndexedFigureDropZones).reduce((a, b) => [...a, ...b], []))?.filter((z, i, a) => a.indexOf(z) === i) ?? [];
};

export const extractFigureDropZoneCount = (doc: Content): [string, number][]=> {
    return (doc.type === "figure" ? ((doc as Figure).dropZones ? [[doc.id as string, (doc as Figure).dropZones!.length]] : []) : doc.children?.map(extractFigureDropZoneCount).reduce((a, b) => [...a, ...b], [])) ?? [];
};
