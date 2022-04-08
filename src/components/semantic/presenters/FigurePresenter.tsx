import React, { useContext } from "react";

import { Figure } from "../../../isaac-data-types";
import { FigureNumberingContext } from "../../../isaac/IsaacTypes";

import styles from "../styles/figure.module.css";
import { ContentValueOrChildrenPresenter } from "./ContentValueOrChildrenPresenter";
import { PresenterProps } from "../registry";
import { BaseValuePresenter } from "./BaseValuePresenter";

export function FigurePresenter(props: PresenterProps<Figure>) {
    const {doc, update} = props;

    const figureNumbering = useContext(FigureNumberingContext);
    const figureNumber = figureNumbering[doc.id as string];
    return <>
        <div className={styles.figureWrapper}>
            <div className={styles.figureImage} title={doc.altText}>
                {doc.src}
            </div>
            <div className={styles.figureCaption}>
                {doc.type === "figure" && <>
                    <h6>{figureNumber ? `Figure ${figureNumber}` : "Set ID to get a figure number"}</h6>
                    <ContentValueOrChildrenPresenter {...props} />
                </>}
                {doc.attribution && <>
                    <BaseValuePresenter doc={{value: doc.attribution, encoding: "markdown"}} update={(newContent) => {
                        update({...doc, attribution: newContent.value});
                    }}/>
                </>}
            </div>
        </div>
    </>;
}
