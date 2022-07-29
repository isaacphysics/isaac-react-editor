import React, {createContext, useContext, useState} from "react";
import {Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row} from "reactstrap";

import {
    IsaacClozeQuestion,
    IsaacItemQuestion,
    IsaacParsonsQuestion,
    IsaacReorderQuestion,
    Item,
    ParsonsItem
} from "../../../isaac-data-types";

import {EditableIDProp, EditableValueProp} from "../props/EditableDocProp";
import {QuestionFooterPresenter} from "./questionPresenters";
import {InserterProps} from "./ListChildrenPresenter";
import {PresenterProps} from "../registry";
import {CheckboxDocProp} from "../props/CheckboxDocProp";
import {ListPresenterProp} from "../props/listProps";
import {ContentValueOrChildrenPresenter} from "./ContentValueOrChildrenPresenter";
import {MetaItemPresenter, MetaOptions} from "../Metadata";

import styles from "../styles/question.module.css";
import {Box} from "../SemanticItem";

interface ItemsContextType {
    items: ParsonsItem[] | undefined;
    remainingItems: ParsonsItem[] | undefined;
    withReplacement: boolean | undefined;
}

export const ItemsContext = createContext<ItemsContextType>(
    {items: undefined, remainingItems: undefined, withReplacement: undefined});
export const ClozeQuestionContext = createContext<boolean>(false);

function isParsonsQuestion(doc: IsaacParsonsQuestion | IsaacClozeQuestion): doc is IsaacParsonsQuestion {
    return doc.type === "isaacParsonsQuestion";
}

function isClozeQuestion(doc: IsaacParsonsQuestion | IsaacClozeQuestion): doc is IsaacClozeQuestion {
    return doc.type === "isaacClozeQuestion";
}

export function ItemQuestionPresenter(props: PresenterProps<IsaacItemQuestion | IsaacReorderQuestion | IsaacParsonsQuestion | IsaacClozeQuestion>) {
    const {doc, update} = props;

    return <>
        {isParsonsQuestion(doc) && <div><CheckboxDocProp doc={doc} update={update} prop="disableIndentation" label="Disable indentation" /></div>}
        {isClozeQuestion(doc) && <div><CheckboxDocProp doc={doc} update={update} prop="withReplacement" label="Allow items to be used more than once" /></div>}
        <div><CheckboxDocProp doc={doc} update={update} prop="randomiseItems" label="Randomise items on question load" /></div>
        <ClozeQuestionContext.Provider value={isClozeQuestion(doc)}>
            <ContentValueOrChildrenPresenter {...props} topLevel />
        </ClozeQuestionContext.Provider>
        {isClozeQuestion(doc) && <ClozeQuestionInstructions />}
        <Box name="Items">
            <Row className={styles.itemsHeaderRow}>
                <Col xs={3} className={styles.center}>
                    ID
                </Col>
                <Col xs={8} className={styles.center}>
                    Value
                </Col>
            </Row>
            <ListPresenterProp {...props} prop="items" childTypeOverride={isParsonsQuestion(doc) ? "parsonsItem" : "item"} />
        </Box>
        <ItemsContext.Provider value={
            {items: doc.items, remainingItems: undefined, withReplacement: isClozeQuestion(doc) && doc.withReplacement}
        }>
            <QuestionFooterPresenter {...props} />
        </ItemsContext.Provider>
    </>;
}

export function ItemPresenter(props: PresenterProps<Item>) {
    return <Row>
        <Col xs={3}>
            <EditableIDProp {...props} />
        </Col>
        <Col xs={8}>
            <EditableValueProp {...props} multiLine />
        </Col>
    </Row>;
}

function ItemRow({item}: {item: Item}) {
    return <Row>
        <Col xs={3}>
            {item.id}
        </Col>
        <Col xs={9}>
            {item.value}
        </Col>
    </Row>
}

// Resuse the MetaItemPresenter as it gives a live editable view
const indentationOptions: MetaOptions = {type: "number", hasWarning: (value) => {
    const num = value as number;
    if (isNaN(num) || num < 0 || num > 3) {
        return "Outside 0–3";
    }
}};

export function ItemChoicePresenter(props: PresenterProps<ParsonsItem>) {
    const {doc, update} = props;
    const [isOpen, setOpen] = useState(false);
    const {items, remainingItems} = useContext(ItemsContext);

    const item = items?.find((item) => item.id === doc.id) ?? {
        id: doc.id,
        value: "Unknown item",
    };

    const dropdown = <Dropdown toggle={() => setOpen(toggle => !toggle)}
                               isOpen={isOpen}>
        <DropdownToggle outline>
            <ItemRow item={item} />
        </DropdownToggle>
        <DropdownMenu>
            <DropdownItem key={item.id} active>
                <ItemRow item={item} />
            </DropdownItem>
            {remainingItems?.map((i) => {
                return <DropdownItem key={i.id} onClick={() => {
                    update({
                        ...doc,
                        id: i.id,
                    });
                }}>
                    <ItemRow item={i} />
                </DropdownItem>;
            })}
        </DropdownMenu>
    </Dropdown>;

    if (doc.type === "parsonsItem") {
        return <div className={styles.parsonsItem}
                    style={{borderLeftWidth: `calc(1px + ${(doc.indentation ?? 0) * 1.5}em)`}}>
            {dropdown}
            <span>
                <MetaItemPresenter {...props} prop="indentation" name="Indent"
                                   options={indentationOptions} />
            </span>
        </div>;
    } else {
        return <div className={styles.itemsChoiceRow}>
            {dropdown}
        </div>;
    }
}

export function ItemChoiceItemInserter({insert, position, lengthOfCollection}: InserterProps) {
    const {items, remainingItems} = useContext(ItemsContext);

    if (!items || !remainingItems) {
        return null; // Shouldn't happen.
    }

    if (position !== lengthOfCollection) {
        return null; // Only include an insert button at the end.
    }
    const item = remainingItems[0];
    if (!item) {
        return null; // No items remaining
    }
    return <Button className={styles.itemsChoiceInserter} color="primary" onClick={() => {
        const newItem: ParsonsItem = {type: item.type, id: item.id};
        if (newItem.type === "parsonsItem") {
            newItem.indentation = 0;
        }
        insert(position, newItem);
    }}>Add</Button>;
}

export function ClozeQuestionInstructions() {
    return <>
        <h3>Defining drop zones</h3>
        <p>To place drop zones within question text, either use the helper button provided, or write <code>[drop-zone]</code> (with the square brackets) - this will then get replaced with a drop zone UI element when the question is rendered. If you want to place drop zones within LaTeX, escape it with the <code>\text</code> environment (but see disclaimer)</p>
        <p>For the drop zones to work correctly, the question exposition must be <b>markdown encoded</b>. This should happen by default.</p>
        <p><small>Disclaimer: drop zones will work in LaTeX for simple use cases, but for very complex and/or nested equations may not work as intended - in summary drop zones in LaTeX are not explicitly supported by us, but it can work for <em>most</em> use cases</small></p>
    </>;
}
