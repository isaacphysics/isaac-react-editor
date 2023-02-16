import React from "react";

import { InteractiveCodeSnippet } from "../../../isaac-data-types";

import { CheckboxDocProp } from "../props/CheckboxDocProp";
import { EditableDocPropFor } from "../props/EditableDocProp";
import { PresenterProps } from "../registry";
import { EnumPropFor } from "../props/EnumProp";

const EditableCode = EditableDocPropFor<InteractiveCodeSnippet>("code", {format: "code"});
const EditableTestCode = EditableDocPropFor<InteractiveCodeSnippet>("testCode", {format: "code"});
const EditableSetupCode = EditableDocPropFor<InteractiveCodeSnippet>("setupCode", {format: "code"});
const EditableUrl = EditableDocPropFor<InteractiveCodeSnippet>("url");

const Languages = {
    python: "Python",
    javascript: "Javascript",
};
const LanguageSelector = EnumPropFor<InteractiveCodeSnippet>("language", Languages);

export function InteractiveCodeSnippetPresenter(props: PresenterProps<InteractiveCodeSnippet>) {
    return <>
        <LanguageSelector {...props} />
        <CheckboxDocProp {...props} prop="disableHighlighting" label="Disable highlighting" />
        <EditableSetupCode {...props} label="Setup Code" block />
        <EditableCode {...props} label="Code" block />
        <CheckboxDocProp {...props} prop="wrapCodeInMain" label="Wrap students code in `main()` function before testing" />
        <EditableTestCode {...props} label="Test Code" block />
        <EditableUrl {...props} label="Url" block />
    </>;
}
