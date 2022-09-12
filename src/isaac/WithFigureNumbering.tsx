import { useRef } from "react";

import {ChoiceQuestion, Content, Question} from "../isaac-data-types";

export function extractFigureId(id: string) {
    return id.replace(/.*?([^|]*)$/g, '$1');
}

export const useFigureNumbering = (doc: Content) => {
    const figureMap = useRef<Record<string, number>>({});

    const figuresOutOfNormalFlow = new Set<string>();
    const newMap = {} as Record<string, number>;
    let n = 1;
    function walk(d: Content | Question | ChoiceQuestion | undefined, outOfNormalFlow: boolean) {
        if (!d) {
            // Nothing to see here. Move along.
            return;
        } else if (d.type === "figure" && d.id) {
            const figureId = extractFigureId(d.id);
            if (outOfNormalFlow) {
                figuresOutOfNormalFlow.add(figureId);
            } else if (!Object.keys(newMap).includes(figureId)) {
                newMap[figureId] = n++;
            }
        } else {
            // Walk all the things that might possibly contain figures. Doesn't blow up if they don't exist.
            if (Array.isArray(d.children)) {
                for (const c of d.children) {
                    walk(c, outOfNormalFlow);
                }
            }
            if (typeof d === "object" && "answer" in d) {
                walk(d.answer, outOfNormalFlow);
                for (const h of d.hints || []) {
                    walk(h, outOfNormalFlow);
                }
                // Walk figures in question choices, marking them as being out of the usual document flow
                if ("choices" in d) {
                    for (const c of d.choices || []) {
                        walk(c.explanation, true);
                    }
                }
            }
            // If we find that some figures aren't getting numbers, add additional walks here to find them.
        }
    }
    walk(doc, false);

    // Add all figures that exist out of the normal flow of the document (figures in choices for example)
    for (const figureId of figuresOutOfNormalFlow.values()) {
        if (!Object.keys(newMap).includes(figureId)) {
            newMap[figureId] = n++;
        }
    }

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
