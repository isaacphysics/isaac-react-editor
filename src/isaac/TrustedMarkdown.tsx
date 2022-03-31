import React from "react";
import Remarkable from "remarkable";
import { LinkOpenToken } from "remarkable/lib";
import { escapeHtml, replaceEntities } from "remarkable/lib/common/utils";

import { TrustedHtml } from "./TrustedHtml";

const converter = new Remarkable({
    html: true,
    linkify: true,
});

converter.renderer.rules.link_open = function(tokens: LinkOpenToken[], idx/* options, env */) {
    const href = escapeHtml(tokens[idx].href || "");
    const localLink = href.startsWith(window.location.origin) || href.startsWith("/") || href.startsWith("mailto:");
    const title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title || "")) + '"') : '';
    if (localLink) {
        return `<a href="${href}" ${title}>`;
    } else {
        return `<a href="${href}" ${title} target="_blank" rel="noopener nofollow">`;
    }
};


export const TrustedMarkdown = React.memo(({markdown}: {markdown: string}) => {
    // Couple of markdown tweaks we need to handle from TrustedMarkdown.tsx
    const regexRules = {
        "[$1]($2)": /\\link{([^}]*)}{([^}]*)}/g,
    };
    Object.assign(regexRules, {
        "[**Glossary**](/glossary)": /\*\*Glossary\*\*/g,
        "[**Concepts**](/concepts)": /\*\*Concepts\*\*/g,
    });
    let regexProcessedMarkdown = markdown;
    Object.entries(regexRules).forEach(([replacement, rule]) =>
        regexProcessedMarkdown = regexProcessedMarkdown.replace(rule, replacement)
    );

    return <TrustedHtml html={converter.render(regexProcessedMarkdown)} span />;
});

TrustedMarkdown.displayName = "TrustedMarkdown";
