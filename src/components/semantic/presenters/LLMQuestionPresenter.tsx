import React from "react";
import { PresenterProps } from "../registry";
import { IsaacLLMFreeTextQuestion, LLMFreeTextMarkedExample, LLMFreeTextMarkSchemeEntry } from "../../../isaac-data-types";
import { NumberDocPropFor } from "../props/NumberDocPropFor";
import { EditableText } from "../props/EditableText";

function MarkSchemeRowPresenter(props: PresenterProps<LLMFreeTextMarkSchemeEntry>) {
    const {doc, update} = props;
    return <tr>
        <td><pre><EditableText text={doc.jsonField} onSave={jsonField => update({...doc, jsonField})} /></pre></td>
        <td><EditableText text={doc.shortDescription} onSave={shortDescription => update({...doc, shortDescription})} /></td>
    </tr>;
}

const MaxMarksEditor = NumberDocPropFor<IsaacLLMFreeTextQuestion>("maxMarks");

function MarkedExampleRowPresenter(props: PresenterProps<LLMFreeTextMarkedExample>) {
    const {doc, update} = props;
    return <tr>
        <td><EditableText text={doc.answer} multiLine onSave={answer => update({...doc, answer})} /></td>
        <td>
            {Object.entries(doc.marks ?? {}).map(([jsonFieldname, value], index) => <div key={jsonFieldname}>
                <EditableText label={jsonFieldname} text={value.toString()} onSave={value =>
                    update({...doc, marks: {...doc.marks, [jsonFieldname]: parseInt(value ?? "0", 10)}})
                } />
            </div>)}
        </td>
        <td>
            <EditableText
                text={doc.marksAwarded?.toString()}
                onSave={marksAwarded => update({...doc, marksAwarded: parseInt(marksAwarded ?? "0", 10)})}
            />
        </td>
    </tr>;
}

export function LLMQuestionPresenter(props: PresenterProps<IsaacLLMFreeTextQuestion>) {
    const {doc, update} = props;

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
                {doc.markScheme?.map((markSchemeItem, index) => <MarkSchemeRowPresenter
                    key={markSchemeItem.jsonField}
                    doc={markSchemeItem}
                    update={newMSI => update({...doc, markScheme: doc.markScheme?.map((msi, i) => i === index ? newMSI : msi)})}
                />)}
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
                    <td><strong>Marking instructions</strong></td>
                    <td>
                        <EditableText
                            text={doc.additionalMarkingInstructions} multiLine
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
                {doc.markedExamples?.map((markedExample, index) => <MarkedExampleRowPresenter
                    key={index}
                    doc={markedExample}
                    update={newME => update({...doc, markedExamples: doc.markedExamples?.map((me, i) => i === index ? newME : me)})}
                />)}
            </tbody>
        </table>
    </div>;
}