import { readdirSync, readFileSync, statSync } from "fs";

import React from "react";
import TestRenderer from 'react-test-renderer';

import { Content } from "../../isaac-data-types";

import { SemanticItem } from "./SemanticItem";
import { SemanticRoot } from "./SemanticRoot";
import { PresenterProps } from "./registry";

// Imperfect, but present accordions and tabs as the original accordion/tab (to test that logic)
// and *also* as a standard list so that all children get presented.
jest.mock("./presenters/AccordionPresenter", () => {
    const original = jest.requireActual("./presenters/AccordionPresenter");
    const ListChildrenPresenter = jest.requireActual("./presenters/ListChildrenPresenter").ListChildrenPresenter;
    const OriginalAccordionPresenter = original.AccordionPresenter;
    return {
        ...original,
        AccordionPresenter: (props: PresenterProps) => {
            return <>
                <OriginalAccordionPresenter {...props} />
                <ListChildrenPresenter {...props} />
            </>;
        },
    };
});

jest.mock("./presenters/TabsPresenter", () => {
    const original = jest.requireActual("./presenters/TabsPresenter");
    const ListChildrenPresenter = jest.requireActual("./presenters/ListChildrenPresenter").ListChildrenPresenter;
    const OriginalTabsPresenter = original.TabsPresenter;
    return {
        ...original,
        TabsPresenter: (props: PresenterProps) => {
            return <>
                <OriginalTabsPresenter {...props} />
                <ListChildrenPresenter {...props} />
            </>;
        },
    };
});


function getFiles(dir: string): string[] {
    const subdirs = readdirSync(dir);
    const files = subdirs.map((subdir) => {
        const res = `${dir}/${subdir}`; //resolve(dir, subdir);
        return statSync(res).isDirectory() ? getFiles(res) : [res];
    });
    return files.reduce((a, f) => a.concat(f), []);
}

function renderDoc(doc: Content) {
    TestRenderer.create(<SemanticRoot doc={doc} update={(newDoc) => {
        fail("update called");
    }}/>);
}

function testFiles(directory: string) {
    const files = getFiles(directory);
    files.forEach((file) => {
        if (!file.endsWith(".json")) return;
        it(`renders ${file.substring(directory.length)} correctly`, () => {
            const doc = JSON.parse(readFileSync(file).toString());
            renderDoc(doc);

            expect(errorLog).toEqual([]);
        });
    });
}

function testFile(file: string) {
    it(`renders ${file} correctly`, () => {
        const doc = JSON.parse(readFileSync(file).toString());
        renderDoc(doc);

        expect(errorLog).toEqual([]);
    });
}

let errorLog: unknown[] = [];
describe("can render existing docs without errors", () => {
    // Capture any errors thrown when rendering
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    SemanticItem.prototype.componentDidCatch = (error, errorInfo) => {
        errorLog.push([error, errorInfo.componentStack]);
    };

    beforeEach(() => {
        errorLog = [];
    });

    // Test the error checking is actually catching errors for a document that breaks the editor.
    it("catches an error when given an invalid document", async () => {
        const brokenDoc = {type: "content", children: "foo"} as unknown as Content;
        renderDoc(brokenDoc);

        expect(errorLog.length).toBeGreaterThan(0);
    });

    it.skip("Can render Computer Science content correctly", () => testFiles("../isaac-content-2/content"));
    it.skip("Can render Physics content correctly", () => testFiles("../rutherford-content/content"));

    // Specific files with errors found previously
    testFile("../rutherford-content/content/questions/chemistry/foundations/atomic_structure/elements_reversal.json");
    testFile("../rutherford-content/content/questions/chemistry/inorganic/bonding/oxides.json");
    testFile("../rutherford-content/content/questions/physics/mechanics/kinematics/level1/glidepath.json");
});
