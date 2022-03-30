import React, { useContext } from "react";

import { Figure } from "../../isaac-data-types";

import {
    EditableSubtitleProp,
    EditableTitleProp,
} from "./EditableDocProp";
import styles from "./figure.module.css";
import { ContentValueOrChildrenPresenter } from "./ContentValueOrChildrenPresenter";
import { FigureNumberingContext } from "../../isaac/IsaacTypes";
import { PresenterProps } from "./registry";

// TODO: Part of the metadata editable world

export function FigurePresenter(props: PresenterProps<Figure>) {
    const {doc, update} = props;

    const figureNumbering = useContext(FigureNumberingContext);
    const figureNumber = figureNumbering[doc.id as string];
    return <>
        <h2><EditableTitleProp {...props} placeHolder="Figure title" hideWhenEmpty/></h2>
        <h3><EditableSubtitleProp {...props} placeHolder="Figure subtitle" hideWhenEmpty/></h3>
        <div className={styles.figureWrapper}>
            <div className={styles.figureImage}>
                {doc.src}
            </div>
            <div className={styles.figureCaption}>
                <h6>{figureNumber ? `Figure ${figureNumber}` : "Set ID to get a figure number"}</h6>
                <ContentValueOrChildrenPresenter {...props} />
            </div>
        </div>
    </>;
}
