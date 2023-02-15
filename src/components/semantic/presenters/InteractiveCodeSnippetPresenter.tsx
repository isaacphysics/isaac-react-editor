import React, { useState } from "react";

import {InteractiveCodeSnippet} from "../../../isaac-data-types";

import { CheckboxDocProp } from "../props/CheckboxDocProp";
import { EditableDocPropFor } from "../props/EditableDocProp";
import { PresenterProps } from "../registry";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

const EditableCode = EditableDocPropFor<InteractiveCodeSnippet>("code", {format: "code"});
const EditableTestCode = EditableDocPropFor<InteractiveCodeSnippet>("testCode", {format: "code"});
const EditableSetupCode = EditableDocPropFor<InteractiveCodeSnippet>("setupCode", {format: "code"});
const EditableUrl = EditableDocPropFor<InteractiveCodeSnippet>("url");

const Languages = {
    python: "Python",
    javascript: "Javascript",
};

function LanguageSelector({doc, update}: PresenterProps<InteractiveCodeSnippet>) {
    const [isOpen, setOpen] = useState(false);

    const language = Languages[doc.language as keyof typeof Languages];

    return <Dropdown toggle={() => setOpen(toggle => !toggle)} isOpen={isOpen}>
        <DropdownToggle caret>
            {language}
        </DropdownToggle>
        <DropdownMenu>
            {Object.entries(Languages).map(([key, possibleType]) => {
                return <DropdownItem key={key} active={language === possibleType} onClick={() => {
                    if (language !== possibleType) {
                        update({
                            ...doc,
                            language: key,
                        });
                    }
                }}>
                    {possibleType}
                </DropdownItem>;
            })}
        </DropdownMenu>
    </Dropdown>;
}

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
