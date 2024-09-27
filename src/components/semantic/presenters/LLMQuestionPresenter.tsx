import React from "react";
import { PresenterProps } from "../registry";
import { IsaacLLMFreeTextQuestion, LLMFreeTextMarkedExample, LLMFreeTextMarkSchemeEntry } from "../../../isaac-data-types";
import { NumberDocPropFor } from "../props/NumberDocPropFor";
import { EditableText } from "../props/EditableText";
import { isDefined } from "../../../utils/types";

const MaxMarksEditor = NumberDocPropFor<IsaacLLMFreeTextQuestion>("maxMarks");

export function LLMQuestionPresenter(props: PresenterProps<IsaacLLMFreeTextQuestion>) {
    const {doc, update} = props;

    function updateMark<T extends keyof LLMFreeTextMarkSchemeEntry>(index: number, field: T, value: LLMFreeTextMarkSchemeEntry[T]) {
        let possiblyUpdatedMarkedExamples = doc.markedExamples;
        if (field === "jsonField") { // also update marked examples mark fieldnames
            const prevJsonFieldValue = doc.markScheme?.[index].jsonField;
            if (isDefined(prevJsonFieldValue)) {
                possiblyUpdatedMarkedExamples = doc.markedExamples?.map(me => {
                    const newMarks = {...me.marks, [value as string]: me.marks?.[prevJsonFieldValue] ?? 0};
                    delete newMarks[prevJsonFieldValue];
                    return { ...me, marks: newMarks };
                });
            }
        }
        update({
            ...doc,
            markScheme: doc.markScheme?.map((msi, i) => i === index ? {...msi, [field]: value} : msi),
            markedExamples: possiblyUpdatedMarkedExamples
        });
    }

    function updateExample<T extends keyof LLMFreeTextMarkedExample>(index: number, field: T, value: LLMFreeTextMarkedExample[T]) {
        update({
            ...doc,
            markedExamples: doc.markedExamples?.map((me, i) => i === index ? {...me, [field]: value} : me)
        });
    }


    return <div>
        <h2 className="h5">Mark scheme</h2>
        <table className="table table-bordered">
            <thead>
                <tr>
                    <td><strong>JSON fieldname</strong></td>
                    <td><strong>Short description</strong></td>
                </tr>
            </thead>
            <tbody>
                {doc.markScheme?.map((mark, i) => <tr key={mark.jsonField}>
                    <td>
                        <pre><EditableText text={mark.jsonField} onSave={value => updateMark(i, "jsonField", value)} /></pre>
                    </td>
                    <td>
                        <EditableText text={mark.shortDescription} multiLine block onSave={value => updateMark(i, "shortDescription", value)} />
                    </td>
                </tr>)}
            </tbody>
            <tfoot>
                <tr>
                    <td><strong><pre>maxMarks</pre></strong></td>
                    <td><MaxMarksEditor {...props} /></td>
                </tr>
                <tr>
                    <td><strong>Marking formula</strong></td>
                    <td>{"/* TODO MT: Input coming soon */"}<input className="w-100" placeholder="MIN(maxMarks, SUM(... all marks ...))" /></td>
                </tr>
                <tr>
                    <td><strong>Additional marking instructions</strong></td>
                    <td>
                        <EditableText
                            text={doc.additionalMarkingInstructions} multiLine block
                            onSave={ams => update({...doc, additionalMarkingInstructions: ams})}
                        />
                    </td>
                </tr>
            </tfoot>
        </table>

        <h2 className="h4">Marked examples</h2>
        <table className="table table-bordered">
            <thead>
                <tr>
                    <td className="w-50"><strong>Answer</strong></td>
                    <td><strong>Marks</strong></td>
                    <td><strong>Mark total</strong></td>
                </tr>
            </thead>
            <tbody>
                {doc.markedExamples?.map((example, i) => <tr key={i}>
                    <td>
                        <EditableText text={example.answer} multiLine block onSave={value => updateExample(i, "answer", value)} />
                    </td>
                    <td>
                        {Object.entries(example.marks ?? {}).sort().map(([jsonFieldname, value]) => <div key={jsonFieldname}>
                            <EditableText label={jsonFieldname} text={value.toString()} onSave={value =>
                                updateExample(i, "marks", {...example.marks, [jsonFieldname]: parseInt(value ?? "0", 10)})
                            } />
                        </div>)}
                    </td>
                    <td>
                        <EditableText
                            text={example.marksAwarded?.toString()}
                            hasError={value => doc.maxMarks && parseInt(value ?? "0", 10) > doc.maxMarks ? "Exceeds question's max marks" : undefined}
                            onSave={value => updateExample(i, "marksAwarded", parseInt(value ?? "0", 10))}
                        />
                    </td>
                </tr>)}
            </tbody>
        </table>
    </div>;
}
