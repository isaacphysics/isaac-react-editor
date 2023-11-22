import React, { useEffect, useRef, useState } from "react";
import { Button, Input } from "reactstrap";
import useSWR from "swr";

import { stagingFetcher } from "../../../services/isaacApi";
import { isAda, siteSpecific } from "../../../services/site";

import { PresenterProps } from "../registry";

import styles from "../styles/tags.module.css";

export function TagsPresenter({doc, update}: PresenterProps) {
    const [searchString, setSearchString] = useState("");
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const {data: tagList} = useSWR<string[]>(
        searchString !== "" ? "content/tags" : null,
        stagingFetcher,
    );
    // TODO: once merged import subjectList from constants
    const subjectList = ["biology","chemistry","physics","maths"]
    const searchList = siteSpecific(subjectList, tagList);
    const [showTagList, setShowTagList] = useState(true);
    const [filteredTagList, setFilteredTagList] = useState<string[]>();

    useEffect(() => {
        setFilteredTagList(searchList?.filter(tag => tag.includes(searchString) && !doc.tags?.includes(tag)));
    }, [searchString, searchList, doc.tags]);

    function addTag(tag: string) {
        if (doc.tags?.includes(tag)) {
            return;
        }

        // Autocomplete if one option remains
        let tagToSet = undefined;
        if (filteredTagList?.length === 1) {
            tagToSet = filteredTagList.at(0);
            setSearchString("");
        }
        // Otherwise, if possible select a tag from the available list
        if (filteredTagList?.includes(tag)) {
            tagToSet = tag;
        }

        if (tagToSet || isAda) {
            update({
                ...doc,
                // Only on Ada will `tag` be potentially used
                // this prevents Physics from creating new subjects
                tags: [...doc.tags ?? [], tagToSet ?? tag],
            });
        }

        if (tag === searchString) {
            setSearchString("");
            inputRef.current?.focus();
        }
    }

    function removeTag(tagToRemove: string) {
        const tags = doc.tags?.filter(tag => tag !== tagToRemove);
        update({...doc, tags});
    }

    function onKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            addTag(searchString);
            e.preventDefault();
        }
    }

    return <div className={styles.wrapper}>
        {doc.tags?.map(tag => <Button key={tag} outline onClick={() => removeTag(tag)}>{tag} ➖</Button>)}
        <Input value={searchString}
               onChange={(e) => setSearchString(e.target.value.toLowerCase())}
               placeholder={`Type to add ${siteSpecific("subjects", "tags")}...`}
               innerRef={inputRef}
               onKeyPress={onKeyPress}
        />
        {searchString !== "" && <div>
            <Button onClick={() => setShowTagList(!showTagList)}>
                {showTagList ? 
                    `Hide ${siteSpecific("subjects", "tags")}` :
                    `Show available ${siteSpecific("subjects", "tags")}`}
            </Button>
            {showTagList && (filteredTagList?.map((tag) =>
                <Button key={tag} outline color="primary" onClick={() => addTag(tag)}>{tag} ➕</Button>
            ) ?? <em>Loading...</em>)}
            {isAda && // Don't allow Physics editors to create new subjects
                <Button color="success" onClick={() => addTag(searchString)}>Create new tag: {searchString} ➕</Button>}
        </div>}
    </div>;
}
