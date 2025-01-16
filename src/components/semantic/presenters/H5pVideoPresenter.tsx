import React from "react";

import { H5pVideo } from "../../../isaac-data-types";

import {
    EditableDocPropFor,
} from "../props/EditableDocProp";
import styles from "../styles/figure.module.css";
import { PresenterProps } from "../registry";

const EditableSrc = EditableDocPropFor<H5pVideo>("src");
const EditableAltText = EditableDocPropFor<H5pVideo>("altText");

export function H5pVideoPresenter(props: PresenterProps<H5pVideo>) {
    return <>
        <div className={styles.figureWrapper}>
            <div className={styles.figureImage}>
                <EditableSrc {...props} label="Path to Video JSON" />
            </div>
            <div className={styles.figureCaption}>
                <EditableAltText {...props} label="Alt text" />
            </div>
        </div>
    </>;
}
