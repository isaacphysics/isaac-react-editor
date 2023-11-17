import React, { useEffect, useRef, useState } from "react";
import { Button, Input } from "reactstrap";
import { GlossaryTerm } from "../../../isaac-data-types";

import { PresenterProps } from "../registry";

import styles from "../styles/tags.module.css";

export function StagePresenter({doc, update}: PresenterProps<GlossaryTerm>) {
    const [searchString, setSearchString] = useState("");
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const [showStageList, setShowStageList] = useState(true);
    const [filteredStageList, setFilteredStageList] = useState<string[]>();

    useEffect(() => {
        const stageList: string[] = ["university", "further_a", "a_level", "gcse", "year_9", "year_7_and_8"];
        setFilteredStageList(stageList?.filter(stage => stage.includes(searchString) && !doc.stages?.includes(stage)));
    }, [searchString, doc.stages]);

    function addStage(stage: string) {
        if (doc.stages?.includes(stage)) {
            return;
        }
        update({
            ...doc,
            stages: [...doc.stages ?? [], stage],
        });
        if (stage === searchString) {
            setSearchString("");
            inputRef.current?.focus();
        }
    }

    function removeStage(stageToRemove: string) {
        const stages = doc.stages?.filter(stage => stage !== stageToRemove);
        update({...doc, stages: stages});
    }

    function onKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            if (filteredStageList?.includes(searchString)) {
                addStage(searchString);
            }
            e.preventDefault();
        }
    }

    return <div className={styles.wrapper}>
        {doc.stages?.map(stage => <Button key={stage} outline onClick={() => removeStage(stage)}>{stage} ➖</Button>)}
        <Input value={searchString}
               onChange={(e) => setSearchString(e.target.value.toLowerCase())}
               placeholder="Type to add stages..."
               innerRef={inputRef}
               onKeyPress={onKeyPress}
        />
        {searchString !== "" && <div>
            <Button onClick={() => setShowStageList(!showStageList)}>
                {showStageList ? "Hide stages" : "Show available stages"}
            </Button>
            {showStageList && (filteredStageList?.map((stage) =>
                <Button key={stage} outline color="primary" onClick={() => addStage(stage)}>{stage} ➕</Button>
            ) ?? <em>Loading...</em>)}
        </div>}
    </div>;
}
