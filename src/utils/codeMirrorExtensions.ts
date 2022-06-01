import {Text, EditorView, Panel, showPanel, Compartment, keymap, EditorSelection} from "@uiw/react-codemirror";
import styles from "../styles/editor.module.css";

function countWords(doc: Text) {
    let count = 0, iter = doc.iter()
    while (!iter.next().done) {
        let inWord = false
        for (let i = 0; i < iter.value.length; i++) {
            let word = /\w/.test(iter.value[i])
            if (word && !inWord) count++
            inWord = word
        }
    }
    return `Word count: ${count}`
}

function wordCountPanel(view: EditorView): Panel {
    let dom = document.createElement("div");
    dom.setAttribute("class", styles.wordCount);
    dom.textContent = countWords(view.state.doc);
    return {
        dom,
        update(update) {
            if (update.docChanged)
                dom.textContent = countWords(update.state.doc);
        }
    }
}

export function wordCounter() {
    return showPanel.of(wordCountPanel);
}


export function isMarkupEncoding(encoding: string | undefined): encoding is "markdown" | "html" {
    return encoding === "markdown" || encoding === "html";
}

export function encodingSpecific<T>(markdownChoice: T, htmlChoice: T, encoding: "markdown" | "html"): T {
    return {
        markdown: markdownChoice,
        html: htmlChoice,
    }[encoding];
}

const emphTextWith = (lemph: string, remph?: string) => (view: EditorView | undefined) => {
    remph = remph ?? lemph;
    const lemphLength = lemph.length;
    const remphLength = remph.length;

    view?.dispatch(view?.state.changeByRange(range => {
        const text = view?.state.sliceDoc(range.from - lemphLength, range.to + remphLength);
        if (text?.slice(0, lemphLength) === lemph && text?.slice(-remphLength) === remph) {
            return {
                changes: [
                    {from: range.from - lemphLength, to: range.from, insert: ""},
                    {from: range.to, to: range.to + remphLength, insert: ""}
                ],
                range: EditorSelection.range(range.from - lemphLength, range.to - lemphLength)
            };
        }
        return {
            changes: [
                {from: range.from, insert: lemph},
                {from: range.to, to: range.to, insert: remph}
            ],
            range: EditorSelection.range(range.from + lemphLength, range.to + lemphLength)
        };
    }));
    return true;
}

export const makeBold = (encoding: "markdown" | "html") => encodingSpecific(emphTextWith("**"), emphTextWith("<b>", "</b>"), encoding);
export const makeItalic = (encoding: "markdown" | "html") => encodingSpecific(emphTextWith("*"), emphTextWith("<i>", "</i>"), encoding);
export const makeStrikethrough = (encoding: "markdown" | "html") => encodingSpecific(emphTextWith("~~"), emphTextWith("<s>", "</s>"), encoding);
export const makeCode = (encoding: "markdown" | "html") => encodingSpecific(emphTextWith("`"), emphTextWith("<pre>", "</pre>"), encoding);

export const keyBindings = (encoding: string | undefined) => {
    if (isMarkupEncoding(encoding)) {
        return keymap.of([
            {
                key: "Ctrl-b",
                run: makeBold(encoding)
            },
            {
                key: "Ctrl-Shift-i",
                run: makeItalic(encoding)
            },
            {
                key: "Ctrl-Shift-s",
                run: makeStrikethrough(encoding)
            },
            {
                key: "Ctrl-Shift-c",
                run: makeCode(encoding)
            }
        ]);
    }
    return [];
};
