import React, { createContext, useContext, useState } from "react";
import { Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from "reactstrap";

import {
    IsaacClozeQuestion,
    IsaacParsonsQuestion,
    Item,
    ParsonsItem
} from "../../../isaac-data-types";

import { EditableIDProp, EditableValueProp } from "../props/EditableDocProp";
import { QuestionFooterPresenter } from "./questionPresenters";
import { InserterProps } from "./ListChildrenPresenter";
import { PresenterProps } from "../registry";
import { CheckboxDocProp } from "../props/CheckboxDocProp";
import { ListPresenterProp } from "../props/listProps";
import { BoxedContentValueOrChildrenPresenter } from "./ContentValueOrChildrenPresenter";
import { MetaItemPresenter, MetaOptions } from "../Metadata";

import styles from "../styles/question.module.css";

interface ItemsContextType {
    items: ParsonsItem[] | undefined;
    remainingItems: ParsonsItem[] | undefined;
}

export const ItemsContext = createContext<ItemsContextType>({items: undefined, remainingItems: undefined});

function isParsonsQuestion(doc: IsaacParsonsQuestion | IsaacClozeQuestion): doc is IsaacParsonsQuestion {
    return doc.type === "isaacParsonsQuestion";
}

function isClozeQuestion(doc: IsaacParsonsQuestion | IsaacClozeQuestion): doc is IsaacClozeQuestion {
    return doc.type === "isaacClozeQuestion";
}

export function ItemQuestionPresenter(props: PresenterProps<IsaacParsonsQuestion | IsaacClozeQuestion>) {
    const {doc, update} = props;

    return <>
        {isParsonsQuestion(doc) && <CheckboxDocProp doc={doc} update={update} prop="disableIndentation" label="Disable indentation" />}
        {isClozeQuestion(doc) && <CheckboxDocProp doc={doc} update={update} prop="withReplacement" label="Allow items to be used more than once" />}
        {isClozeQuestion(doc) && <CheckboxDocProp doc={doc} update={update} prop="randomiseItems" label="Randomise items on question load" />}
        <BoxedContentValueOrChildrenPresenter {...props} />
        {isClozeQuestion(doc) && <ClozeQuestionInstructions />}
        <h6 className={styles.itemsHeaderTitle}>Items</h6>
        <Row className={styles.itemsHeaderRow}>
            <Col xs={3} className={styles.center}>
                ID
            </Col>
            <Col xs={8} className={styles.center}>
                Value
            </Col>
        </Row>
        <ListPresenterProp {...props} prop="items" childTypeOverride={isParsonsQuestion(doc) ? "parsonsItem" : "item"} />
        <ItemsContext.Provider value={{items: doc.items, remainingItems: undefined}}>
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

export function ItemChoiceItemInserter({insert, position}: InserterProps) {
    const {items, remainingItems} = useContext(ItemsContext);

    if (!items || !remainingItems) {
        return null; // Shouldn't happen.
    }

    const usedCount = items.length - remainingItems.length;

    if (position < usedCount) {
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
        <p>To place drop zones within question text, write [drop-zone] (with the square brackets) - this will then get replaced with a drop zone UI element when the question is rendered. If you want to place drop zones within LaTeX, escape it with the <code>\text</code> environment (but see disclaimer)</p>
        <p>For the drop zones to work correctly, the question exposition must be HTML encoded - if you would like to use markdown please use a <a href={"https://markdowntohtml.com/"}>markdown to HTML converter</a>.</p>
        <p><small>Disclaimer: drop zones will work in LaTeX for simple use cases, but for very complex and/or nested equations may not work as intended - in summary drop zones in LaTeX are not explicitly supported by us, but it can work for <em>most</em> use cases</small></p>
    </>;
}
