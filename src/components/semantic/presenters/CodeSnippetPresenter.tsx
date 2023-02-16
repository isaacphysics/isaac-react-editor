import React from "react";

import { CodeSnippet } from "../../../isaac-data-types";

import { CheckboxDocProp } from "../props/CheckboxDocProp";
import { EditableDocPropFor } from "../props/EditableDocProp";
import { PresenterProps } from "../registry";
import {EnumPropFor} from "../props/EnumProp";

const EditableCode = EditableDocPropFor<CodeSnippet>("code", {format: "code"});
const EditableUrl = EditableDocPropFor<CodeSnippet>("url");

const Languages = {
    python: "Python",
    javascript: "Javascript",
    csharp: "C#",
    php: "PHP",
    sql: "SQL",
    assembly: "Assembly",
    pseudocode: "Isaac Pseudocode",
};
const LanguageSelector = EnumPropFor<CodeSnippet>("language", Languages);

export function CodeSnippetPresenter(props: PresenterProps<CodeSnippet>) {
    return <>
        <LanguageSelector {...props} />
        <CheckboxDocProp {...props} prop="disableHighlighting" label="Disable highlighting" />
        <EditableCode {...props} label="Code" block />
        <EditableUrl {...props} label="Url" block />
    </>;
}
