import React, { createContext, useContext, useState } from "react";
import { Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from "reactstrap";

import { IsaacParsonsQuestion, Item, ParsonsItem } from "../../../isaac-data-types";

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

export function ItemOrParsonsQuestionPresenter(props: PresenterProps<IsaacParsonsQuestion>) {
    const {doc} = props;

    return <>
        {doc.type === "isaacParsonsQuestion" && <CheckboxDocProp {...props} prop="disableIndentation" label="Disable indentation" />}
        <BoxedContentValueOrChildrenPresenter {...props} />
        <h6>Items</h6>
        <Row className={styles.itemsHeaderRow}>
            <Col xs={3} className={styles.center}>
                ID
            </Col>
            <Col xs={8} className={styles.center}>
                Value
            </Col>
        </Row>
        <ListPresenterProp {...props} prop="items" />
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
