import React, { useState } from "react";
import { Button, Input } from "reactstrap";
import useSWR from "swr";

import { Content } from "../../../isaac-data-types";
import { stagingFetcher } from "../../../services/isaacApi";

import { PresenterProps } from "../registry";

import styles from "../styles/tags.module.css";

function readableContentType(type: string | undefined) {
    switch (type) {
        case "isaacQuestionPage":
            return "Question";
        case "isaacConceptPage":
            return "Concept";
        case "isaacTopicSummaryPage":
            return "TopicSummary";
        default:
            return type;
    }
}

function ContentDescription({content}: { content: Content }) {
    return <>
        {content.title} ({readableContentType(content.type)})
        <br/>
        <small>{content.id}</small>
    </>;
}

export function RelatedContentPresenter({doc, update}: PresenterProps) {
    const [searchString, setSearchString] = useState("");

    const {data: relatedContent} = useSWR<{results: Content[]}>(
        "search?query=" + encodeURIComponent(searchString) + "&types=isaacConceptPage,isaacQuestionPage",
        stagingFetcher,
    );

    function addRelatedContent(id: string) {
        if (doc.relatedContent?.includes(id)) {
            return;
        }
        update({
            ...doc,
            relatedContent: [...doc.relatedContent ?? [], id],
        });
    }

    function removeRelatedContent(idToRemove: string) {
        const relatedContent = doc.relatedContent?.filter(id => id !== idToRemove);
        update({...doc, relatedContent});
    }

    return <div className={styles.wrapper}>
        {doc.relatedContent?.map(id => <Button key={id} outline onClick={() => removeRelatedContent(id)}>{id} ➖</Button>)}
        <Input value={searchString}
               onChange={(e) => setSearchString(e.target.value)}
               placeholder="Type to add related content..."
        />
        {searchString !== "" && <div>
            {(relatedContent?.results?.map((content) => {
                if (!content.id) return null;
                if (doc.relatedContent?.includes(content.id)) {
                    return null;
                }
                return <Button key={content.id} outline color={content.type === "isaacQuestionPage" ? "success" : "primary"}
                               onClick={() => addRelatedContent(content.id as string)}>
                    <ContentDescription content={content} /> ➕
                </Button>;
            }) ?? <em>Loading...</em>)}
        </div>}
    </div>;
}
