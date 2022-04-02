import { useRef } from "react";

import { Content, Question } from "../isaac-data-types";

export function extractFigureId(id: string) {
    return id.replace(/.*?([^|]*)$/g, '$1');
}

export const useFigureNumbering = (doc: Content) => {
    const figureMap = useRef<Record<string, number>>({});

    const newMap = {} as Record<string, number>;
    let n = 1;
    function walk(d: Content|Question|undefined) {
        if (!d) {
            // Nothing to see here. Move along.
            return;
        } else if (d.type === "figure" && d.id) {
            const figureId = extractFigureId(d.id)
            if (!Object.keys(newMap).includes(figureId)) {
                newMap[figureId] = n++;
            }
        } else {
            // Walk all the things that might possibly contain figures. Doesn't blow up if they don't exist.
            if (Array.isArray(d.children)) {
                for (const c of d.children) {
                    walk(c);
                }
            }
            if (typeof d === "object" && "answer" in d) {
                walk(d.answer);
                for (const h of d.hints || []) {
                    walk(h);
                }
            }
            // If we find that some figures aren't getting numbers, add additional walks here to find them.
        }
    }
    walk(doc);

    // Check maps match, or update ref if they do not.
    const oldMap = figureMap.current;
    const newKeys = Object.keys(newMap);
    const oldKeys = Object.keys(oldMap);
    if (newKeys.length !== oldKeys.length || !newKeys.every((key) => {
        return newMap[key] === oldMap[key];
    })) {
        figureMap.current = newMap;
    }

    return figureMap.current;
};
