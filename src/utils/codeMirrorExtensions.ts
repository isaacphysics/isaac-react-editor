import {Text, EditorView, Panel, showPanel} from "@uiw/react-codemirror";
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