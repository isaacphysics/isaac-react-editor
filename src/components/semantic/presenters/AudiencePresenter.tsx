import React, {Fragment, useState} from "react";
import {Button} from "reactstrap";

import {AudienceContext, Difficulty, ExamBoard, RoleRequirement, Stage} from "../../../isaac-data-types";
import {isAda, siteSpecific} from "../../../services/site";
import {ExtractRecordArrayValue, isDefined} from "../../../utils/types";

import {PresenterProps} from "../registry";
import styles from "../styles/audience.module.css";

function adaDifficulty(doc : AudienceContext[]): Difficulty | undefined {
    return  isAda && doc[0].difficulty ? doc[0].difficulty[0] : undefined;
} 

function defaultAudience(): AudienceContext {
    return isAda ? {stage: ["core"], examBoard: ["ada"]} : {stage: ["a_level"]};
}
function defaultAudienceWithDifficulty(doc: AudienceContext[]): AudienceContext{
    return {stage: ["core"], examBoard: ["ada"], difficulty: (adaDifficulty(doc) ? [adaDifficulty(doc)] : undefined)} as AudienceContext;
} 

type AudienceKey = keyof AudienceContext;
type AudienceValue = ExtractRecordArrayValue<Required<AudienceContext>>;

const phyStages: Stage[] = ["university", "further_a", "a_level", "gcse", "year_9", "year_7_and_8"];
const difficulties: Difficulty[] = ["practice_1", "practice_2", "practice_3", "challenge_1", "challenge_2", "challenge_3"];

const csStages: Stage[] = ["a_level", "gcse", "scotland_national_5", "scotland_higher", "scotland_advanced_higher", "core", "advanced"];
const csExamBoards: ExamBoard[] = ["aqa", "ocr", "cie", "edexcel", "eduqas", "wjec", "sqa", "ada"];
const csStagedExamBoards: Partial<Record<Stage, ExamBoard[]>> = {
    "a_level": ["aqa", "cie", "eduqas", "ocr", "wjec"],
    "gcse": ["aqa", "edexcel", "eduqas", "ocr", "wjec"],
    "scotland_national_5": ["sqa"],
    "scotland_higher": ["sqa"],
    "scotland_advanced_higher": ["sqa"],
    "core": ["ada"],
    "advanced": ["ada"],
};

function isExamboardArray(arr: string[]): arr is ExamBoard[] {
    return arr.every(v => csExamBoards.includes(v));
}

function examBoardsForStage(audienceContext: AudienceContext): ExamBoard[] {
    const stageSpecificExamBoards = audienceContext.stage?.length === 1 && csStagedExamBoards[audienceContext.stage[0]];
    return stageSpecificExamBoards || csExamBoards;
}

function allExamBoardsForStagePresent(audienceContext: AudienceContext) {
    if (Object.keys(audienceContext).indexOf("examBoard") === -1) return false;
    if (Object.keys(audienceContext).indexOf("stage") === -1) return false;
    if (audienceContext.stage?.length !== 1) return false;
    const possibleExamBoards = examBoardsForStage(audienceContext);
    if (possibleExamBoards.length !== audienceContext.examBoard?.length) return false;
    return possibleExamBoards.every(examBoard => audienceContext.examBoard?.indexOf(examBoard) !== -1);
}

const roles: RoleRequirement[] = ["logged_in", "teacher"]; //, "event_leader", "content_editor", "event_manager", "admin"];

type Possibilities = Partial<Record<AudienceKey, AudienceValue[]>>;
function getPossibleFields(type?: string): Possibilities {
    if (isAda) {
        switch (type) {
            case "accordion":
                return {stage: csStages, examBoard: csExamBoards, role: roles};
            default:
                return {stage: csStages, examBoard: csExamBoards};
        }
    } else { //if isPhy OR default
        switch (type) {
            case "accordion":
                return {stage: phyStages};
            default:
                return {stage: phyStages, difficulty: difficulties};
        }
    }
}

function AudienceContextPresenter({doc, update, possible}: PresenterProps<AudienceContext> & {possible: Possibilities}) {
    let unusedKeysAndFirstOption =
        Object.keys(possible).map((k) => {
            const key = k as AudienceKey;
            return [key, possible[key as keyof typeof possible]?.[0]] as [AudienceKey, AudienceValue];
        });

    const filteredItems = Object.keys(doc).map((k) => {
        const key = k as AudienceKey;
        const values = doc[key];
        if (values) {
            unusedKeysAndFirstOption = unusedKeysAndFirstOption.filter(([k]) => k !== key);

            const filteredUnusedOptions = new Set(possible[key]);

            // Restrict Exam Board options by Stage selection if set
            if (isAda && isExamboardArray(values) && doc.stage && doc.stage.length === 1) {
                filteredUnusedOptions.forEach((value) => {
                    if (!examBoardsForStage(doc).includes(value as ExamBoard)) {
                        filteredUnusedOptions.delete(value);
                    }
                });

                // Remove from values as well to prevent illegal combinations
                values.forEach((value, i) => {
                    if (!examBoardsForStage(doc).includes(value as ExamBoard)) {
                        values.splice(i, 1);
                    }
                })

                // Select a default value
                if (values.length < 1) values.push(examBoardsForStage(doc)[0]);
            }

            // Remove used options
            values.forEach((value) => filteredUnusedOptions.delete(value));

            return {
                key,
                values,
                unusedOptions: [...filteredUnusedOptions],
            };
        }
        return undefined;
    }).filter(isDefined);
    const multiple = filteredItems.reduce((count, {values}) => count + values.length, 0) > 1;

    const items = filteredItems.map(({key, values, unusedOptions}, i) => {
        const updateValues = (newValues: AudienceValue[]) => {
            const newDoc = {...doc};
            if (newValues.length === 0) {
                delete newDoc[key];
            } else {
                // We know the values correspond to the right key, but tsc doesn't.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                newDoc[key] = newValues;
            }
            update(newDoc);
        };
        const AudienceValue = ({index}: { index?: number }) => {
            const value = values[index ?? 0];
            return <>
                <select value={value} onChange={(e) => {
                    const newValues = [...values];
                    newValues[index ?? 0] = e.target.value as AudienceValue;
                    updateValues(newValues);
                }}>
                    <option key={value}>{value}</option>
                    {[...unusedOptions].map((possibleOption) =>
                        <option key={possibleOption}>{possibleOption}</option>
                    )}
                </select>
                {multiple && <Button outline size="sm" className="border-0 p-0 ml-1" onClick={() => {
                    // ESLint is very confused by the following line...
                    // eslint-disable-next-line react/prop-types
                    updateValues((values as string[]).filter(v => v !== value) as AudienceValue[]);
                }}>➖</Button>}
                {/* ESLint is very confused by the following line... */}
                {/* eslint-disable-next-line react/prop-types */}
                {index !== undefined && index < values.length - 1 && ", "}
            </>;
        };

        if (isAda && key === "difficulty") {
            return null;
        }

        return <Fragment key={key}>
            {/* Key */}
            <select value={key} onChange={(e) => {
                const newKey = e.target.value;
                const newValue = e.target.options[e.target.selectedIndex].dataset["audiencevalue"];
                update({
                    ...doc,
                    [key]: undefined,
                    [newKey]: [newValue],
                });
            }}>
                <option key={key}>{key}</option>
                {unusedKeysAndFirstOption.map(([possibleKey, audienceValue]) =>
                    <option key={possibleKey} data-audiencevalue={audienceValue}>{possibleKey}</option>
                )}
            </select>

            {/* Value(s) */}
            {!(key === "examBoard" && allExamBoardsForStagePresent(doc)) && <Fragment>
                {values.length === 1 ?
                    <> = <AudienceValue/></>
                    : <> IN [{values.map((value, index) => <AudienceValue key={index} index={index}/>)}</>
                }

                {unusedOptions.length > 0 && <Button outline size="sm" className="border-0 p-0 ml-1" onClick={() => {
                    updateValues([...values, unusedOptions[0]]);
                }}>➕</Button>}
                {key === "examBoard" && <Button outline size="sm" className="ml-1" onClick={() => {updateValues(examBoardsForStage(doc))}}>
                    ALL
                </Button>}
                {values.length > 1 && "]"}
            </Fragment>}

            {key === "examBoard" && allExamBoardsForStagePresent(doc) && <Fragment>
                {" IN [ALL]"}
                <Button outline size="sm" className="ml-1" onClick={() => {const [_first, ...rest] = values; updateValues(rest)}}>
                    NOT ALL
                </Button>
            </Fragment>}

            {/* Connector */}
            {(isAda && filteredItems[filteredItems.length - 1].key === "difficulty" && i === filteredItems.length - 2) ? "" :
                filteredItems.length > 1 && i < filteredItems.length - 1 && " AND "}
        </Fragment>;
    });
    return <>
        {items}
        {unusedKeysAndFirstOption.length > 0 && <>{" "}<Button outline size="sm" onClick={() => {
            update({...doc, [unusedKeysAndFirstOption[0][0]]: [unusedKeysAndFirstOption[0][1]]});
        }}>AND ➕</Button></>}
    </>;
}

function safeJoin(list: string[], joiner: string): string {
    if (list.length === 0) {
        return "any";
    }
    if (list.length === 1) {
        return list[0];
    }
    list = list.filter((item) => (isAda && difficulties.includes(item as Difficulty)) ? false : true);
    return list.map((item) => item.replaceAll(joiner, "").includes(" ") ? `(${item})` : item).join(joiner);
}

function conciseAudience(audience: AudienceContext): string {
    const result = Object.keys(audience).map((k) => {
        const key = k as keyof AudienceContext;
        const values = audience[key];
        if (values) {
            if (key === "examBoard" && allExamBoardsForStagePresent(audience)) return "any\u00A0exam\u00A0board";
            else return values.join(" or ");
        }
        return undefined;
    }).filter(isDefined);
    return safeJoin(result, " and ");
}

function conciseAudiences(audiences: AudienceContext[] | undefined | null, type?: string) {
    if (audiences === undefined || audiences === null) {
        return type === "accordion" ? "All" : "None set";
    }

    if (adaDifficulty(audiences)) {
        return safeJoin(audiences.map((audience) => conciseAudience(audience)), " or ") + " and " + adaDifficulty(audiences);
    }

    return safeJoin(audiences.map((audience) => conciseAudience(audience)), " or ");
}

function AudienceEditor({doc, update, possible}: PresenterProps<AudienceContext[]> & {possible: Possibilities}) {
    return <>
        {doc.map((audience, index) => {
            return <div key={index} className={styles.editorRow}>
                (<AudienceContextPresenter doc={audience}
                                           update={(newAudience: AudienceContext) => {
                                               const audience = [...doc];
                                               audience[index] = newAudience;
                                               update(audience);
                                           }}
                                           possible={possible}
                />)
                {doc.length > 1 && <Button outline size="sm" className="border-0 p-0 ml-1" onClick={() => {
                    const audience = [...doc];
                    audience.splice(index, 1);
                    update(audience);
                }}>➖</Button>}
                {index === doc.length - 1 ? <Button outline size="sm" onClick={() => {
                    update(siteSpecific([...doc, defaultAudience()], [...doc, defaultAudienceWithDifficulty(doc)]));
                }}>OR ➕</Button> : " OR"}
            </div>;
        })}
    </>
}

function DifficultyEditor({doc, update, possible}: PresenterProps<AudienceContext[]> & {possible: Possibilities}) {
    const updateDifficulty = (newDifficulty: Difficulty) => {
        const audiences = [...doc];
        audiences.forEach((audience) => {
            newDifficulty ? audience.difficulty = [newDifficulty] : audience.difficulty = undefined;
        });
        update(audiences);
    }

    const key = doc[0].difficulty ? doc[0].difficulty[0] : "";
    const unusedOptions = new Set([...possible.difficulty as Difficulty[], ""])
    unusedOptions.delete(key);

    return <>
        Difficulty: {' '}
        <select value={key} onChange={(e) => { updateDifficulty(e.target.value as Difficulty); }}>
                <option key={key}>{key}</option>
                {[...unusedOptions].map((possibleOption) =>
                    <option key={possibleOption}>{possibleOption}</option>
                )}
        </select>
    </>
}

export function AudiencePresenter({doc, update, type}: PresenterProps & {type?: string}) {
    const [editingAudience, setEditingAudience] = useState<AudienceContext[]>();

    function close() {
        setEditingAudience(undefined);
    }

    function setChanges() {
        close();
        update({...doc, audience: editingAudience});
    }

    if (!editingAudience) {
        return <div key="view" className={`${styles.wrapper} ${styles.view}`}>
            {conciseAudiences(doc.audience, type)}
            <Button size="sm" onClick={(e) => {
                setEditingAudience(doc.audience ?? [defaultAudience()]);
            }}>
                Edit
            </Button>
        </div>;
    } else {
        // eslint-disable-next-line
        return <div
            key="edit" className={`${styles.wrapper} ${type === "accordion" ? styles.rightAlign : ""}`}
            onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Enter") {
                    setChanges();
                } else if (e.key === "Escape") {
                    close();
                }
            }}
        >
            <AudienceEditor doc={editingAudience} update={setEditingAudience} possible={getPossibleFields(type)} />
            {isAda ? <> 
                <DifficultyEditor doc={editingAudience} update={setEditingAudience} possible={{difficulty: difficulties}}/> 
                <br/> 
            </> : null}
            Concise: {conciseAudiences(editingAudience)}
            <Button size="sm" color="primary" onClick={setChanges}>Set</Button>
            <Button size="sm" onClick={close}>Cancel</Button>
            <Button size="sm" color="danger" onClick={() => {
                close();
                update({...doc, audience: undefined});
            }}>Clear</Button>
        </div>;
    }
}
