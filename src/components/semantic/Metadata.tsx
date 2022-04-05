import React, { ChangeEvent, useEffect, useState } from "react";
import { Col, Form, FormText, Input, Label } from "reactstrap";
import { InputType } from "reactstrap/lib/Input";

import { Content } from "../../isaac-data-types";

import { PresenterProps } from "./registry";
import styles from "./metadata.module.css";
import { MetaItems } from "./metaItems";

interface MetaOptions {
    hasWarning?: (value: string) => string | undefined;
    type?: InputType;
    presenter?: React.FunctionComponent<MetaItemPresenterProps>;
    defaultValue?: any;
}
type MetaItem = string | [string, MetaOptions];

// This identity helper function exists to generate the type T, which is record scoped to our
// particular keys, which means we can extract the useful type MetaItemKey below.
// See, for example, https://stackoverflow.com/a/67453994.
export function asMetaItems<T extends Record<string, MetaItem>>(metaItems: T) {
    return metaItems;
}

export type MetaItemKey = keyof typeof MetaItems;

export const defaultMeta: MetaItemKey[] = ["id", "title", "subtitle", "author"];

function getMetaItem(item: MetaItemKey): [string, MetaOptions] {
    const metaItem = MetaItems[item];
    if (Array.isArray(metaItem)) {
        return metaItem;
    }
    return [metaItem, {}];
}

function checkWarning(options: MetaOptions, newValue: string, setWarning: (value: (string | undefined)) => void) {
    if (options.hasWarning) {
        const warning = options.hasWarning(newValue);
        if (warning) {
            setWarning(warning);
        } else {
            setWarning(undefined);
        }
    }
}

export type MetaItemPresenterProps<D extends Content = Content> =
    PresenterProps<D>
    & {
       prop: string;
        name: string;
        options: MetaOptions
    }
;

function MetaItemPresenter({doc, update, prop, name, options}: MetaItemPresenterProps) {
    const value = (doc[prop as keyof Content] as string || options.defaultValue) ?? "";
    const [warning, setWarning] = useState<string>();

    const onChange = (newValue: string) => {
        if (options.type === "number") {
            newValue = parseInt(newValue, 10) as unknown as string;
        }
        checkWarning(options, newValue, setWarning);
        update({
            ...doc,
            [prop]: newValue,
        });
    };

    const valueOnChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
    const checkedOnChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked as unknown as string);

    return <>
        <Input type={options.type ?? "text"}
               value={options.type !== "checkbox" ? value : undefined}
               checked={options.type === "checkbox" ? value as unknown as boolean : undefined}
               onChange={options.type !== "checkbox" ? valueOnChange : checkedOnChange}
               invalid={!!warning}
        />
        {warning && <FormText>{warning}</FormText>}
    </>;
}

export function MetadataPresenter(props: PresenterProps & { metadata: MetaItemKey[] }) {
    const {metadata, ...rest} = props;
    return <Form>
        {metadata.map((prop) => {
            const [name, options] = getMetaItem(prop);
            const Presenter = options.presenter ?? MetaItemPresenter;
            return <Label key={prop} className={styles.row}>
                <Col xs={2} className={styles.label}>
                    {name}
                </Col>
                <Col xs={10}>
                    <Presenter {...rest} prop={prop} name={name} options={options} />
                </Col>
            </Label>;
        })}
    </Form>;
}
