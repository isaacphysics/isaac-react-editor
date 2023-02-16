import {Content} from "../../../isaac-data-types";
import {KeysWithValsOfType} from "../../../utils/types";
import {PresenterProps} from "../registry";
import React, {useState} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";

// FIXME the types aren't *quite* right...
export const EnumPropFor = <
    D extends Content,
    K extends KeysWithValsOfType<D, string | undefined> = KeysWithValsOfType<D, string | undefined>,
    >(prop: K, options: {[key in string]: string | undefined}) => {
    return function EnumProp({doc, update}: PresenterProps<D>) {
        const [isOpen, setOpen] = useState(false);
        const current = options[doc[prop] as unknown as keyof typeof options];
        return <Dropdown toggle={() => setOpen(toggle => !toggle)} isOpen={isOpen}>
            <DropdownToggle caret>
                {current ?? "-"}
            </DropdownToggle>
            <DropdownMenu>
                {Object.entries(options).map(([key, option]) => {
                    return <DropdownItem key={key} active={current === option} onClick={() => {
                        if (current !== option) {
                            update({
                                ...doc,
                                [prop]: key,
                            });
                        }
                    }}>
                        {option}
                    </DropdownItem>;
                })}
            </DropdownMenu>
        </Dropdown>
    };
};
