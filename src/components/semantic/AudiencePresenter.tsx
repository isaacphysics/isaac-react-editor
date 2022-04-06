import React, { Fragment, useState } from "react";
import { Button } from "reactstrap";

import { AudienceContext } from "../../isaac-data-types";
import { ExtractRecordArrayValue, isDefined } from "../../utils/types";

import { PresenterProps } from "./registry";
import styles from "./audience.module.css";

function defaultAudience(): AudienceContext {
    return {"stage": ["a_level"]};
}

type AudienceKey = keyof AudienceContext;
type AudienceValue = ExtractRecordArrayValue<Required<AudienceContext>>;
const audienceContextKeys: AudienceKey[] = ["stage", "examBoard", "difficulty", "role"];
const optionsFor: Required<AudienceContext> = {
    stage: ["year_7", "year_8", "year_9", "gcse", "a_level", "further_a", "university", "all"],
    examBoard: ["aqa", "ocr", "cie", "edexcel", "eduqas", "wjec", "all"],
    difficulty: ["practice_1", "practice_2", "practice_3", "challenge_1", "challenge_2", "challenge_3"],
    role: ["logged_in", "teacher"],
};

function AudienceContextPresenter({doc, update}: PresenterProps<AudienceContext>) {
    let unusedKeysAndFirstOption: [AudienceKey, AudienceValue][] =
        audienceContextKeys.map((key) => {
            return [key, optionsFor[key][0]];
        });

    const filteredItems = Object.keys(doc).map((k) => {
        const key = k as AudienceKey;
        const values = doc[key];
        if (values) {
            unusedKeysAndFirstOption = unusedKeysAndFirstOption.filter(([k]) => k !== key);
            const unusedOptions = new Set(optionsFor[key]);
            values.forEach((value) => unusedOptions.delete(value));
            return {
                key,
                values,
                unusedOptions: [...unusedOptions],
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
                {multiple && <Button outline size="sm" onClick={() => {
                    // ESLint is very confused by the following line...
                    // eslint-disable-next-line react/prop-types
                    updateValues((values as string[]).filter(v => v !== value) as AudienceValue[]);
                }}>➖</Button>}
                {/* ESLint is very confused by the following line... */}
                {/* eslint-disable-next-line react/prop-types */}
                {index !== undefined && index < values.length - 1 && ", "}
            </>;
        };
        return <Fragment key={key}>
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
                    <option key={possibleKey}
                            data-audiencevalue={audienceValue}>{possibleKey}</option>
                )}
            </select>
            {values.length === 1 ?
                <> = <AudienceValue/></>
                : <> IN [{values.map((value, index) => <AudienceValue key={index}
                                                                      index={index}/>)}</>
            }
            {unusedOptions.length > 0 && <Button outline size="sm" onClick={() => {
                updateValues([...values, unusedOptions[0]]);
            }}>➕</Button>}
            {values.length > 1 && "]"}
            {filteredItems.length > 1 && i < filteredItems.length - 1 && " AND "}
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
    return list.map((item) => item.replaceAll(joiner, "").includes(" ") ? `(${item})` : item).join(joiner);
}

function conciseAudience(audience: AudienceContext): string {
    const result = audienceContextKeys.map((k) => {
        const key = k as keyof AudienceContext;
        const values = audience[key];
        if (values) {
            return values.join(" or ");
        }
        return undefined;
    }).filter(isDefined);
    return safeJoin(result, " and ");
}

function conciseAudiences(audiences: AudienceContext[] | undefined) {
    if (audiences === undefined) {
        return "None set";
    }
    return safeJoin(audiences.map((audience) => conciseAudience(audience)), " or ");
}

function AudienceEditor({doc, update}: PresenterProps<AudienceContext[]>) {
    return <>
        {doc.map((audience, index) => {
            return <div key={index}>
                (<AudienceContextPresenter doc={audience}
                                           update={(newAudience: AudienceContext) => {
                                               const audience = [...doc];
                                               audience[index] = newAudience;
                                               update(audience);
                                           }}/>)
                {doc.length > 1 && <Button outline size="sm" onClick={() => {
                    const audience = [...doc];
                    audience.splice(index, 1);
                    update(audience);
                }}>➖</Button>}
                {index === doc.length - 1 ? <Button outline size="sm" onClick={() => {
                    update([...doc, defaultAudience()]);
                }}>OR ➕</Button> : " OR"}
            </div>;
        })}
        Concise: {conciseAudiences(doc)}
    </>
}

export function AudiencePresenter({doc, update}: PresenterProps) {
    const [editingAudience, setEditingAudience] = useState<AudienceContext[]>();

    function close() {
        setEditingAudience(undefined);
    }

    if (!editingAudience) {
        return <div key="view" className={styles.wrapper}>
            {conciseAudiences(doc.audience)}
            <Button onClick={(e) => {
                setEditingAudience(doc.audience ?? [defaultAudience()]);
            }}>
                Edit
            </Button>
        </div>;
    } else {
        return <div key="edit" className={styles.wrapper}>
            <AudienceEditor doc={editingAudience} update={setEditingAudience} />
            <Button color="primary" onClick={(e) => {
                close();
                update({...doc, audience: editingAudience});
            }}>Set</Button>
            <Button onClick={() => {
                close();
            }}>Cancel</Button>
            <Button color="danger" onClick={() => {
                close();
                update({...doc, audience: undefined});
            }}>Clear</Button>
        </div>;
    }
}
