import React from "react";

import { IsaacInlineQuestion } from "../../../isaac-data-types";
import { PresenterProps } from "../registry";
import { ListPresenterProp } from "../props/listProps";
import { Box } from "../SemanticItem";

function Instructions() {
    return <div className="my-2">Enter the question above, representing any inline question part with <code>[inline-question:id]</code>. Then, add a new inline question part below, setting the question ID to be <code>inline-question:id</code>. These will then link automatically.</div>
}

export function InlinePartsPresenter(props: PresenterProps<IsaacInlineQuestion>) {
    return <Box name="Inline Parts">
        <Instructions />
        <ListPresenterProp {...props}
                           prop="inlineQuestions"
                           childTypeOverride="inlineQuestionPart"
        />
    </Box>;
}

