import {Content, Figure} from "../isaac-data-types";

export const extractValueOrChildrenText = (doc: Content): string => {
    return (doc.value || doc.children?.map(extractValueOrChildrenText).join("\n")) ?? "";
};

export const extractFigureDropZonesCount = (doc: Content): number => {
    return (doc.type === "figure" ? (doc as Figure).dropZones?.length : doc.children?.map(extractFigureDropZonesCount).reduce((a, b) => a + b, 0)) ?? 0;
}
