import React, { useContext, useEffect, useRef } from "react";

import { Figure } from "../../../isaac-data-types";
import { FigureNumberingContext } from "../../../isaac/IsaacTypes";
import { ContentValueOrChildrenPresenter } from "./ContentValueOrChildrenPresenter";
import { PresenterProps } from "../registry";
import { BaseValuePresenter } from "./BaseValuePresenter";
import { githubUpload, useGithubContents } from "../../../services/github";
import { AppContext } from "../../../App";
import { dirname } from "../../../utils/strings";
import { useFixedRef } from "../../../utils/hooks";

import styles from "../styles/figure.module.css";

export function FigurePresenter(props: PresenterProps<Figure>) {
    const {doc, update} = props;
    const docRef = useFixedRef(doc);

    const figureNumbering = useContext(FigureNumberingContext);
    const figureNumber = figureNumbering[doc.id as string];

    const appContext = useContext(AppContext);
    const basePath = dirname(appContext.selection.getSelection()?.path) as string;
    const {data} = useGithubContents(appContext, doc.src !== undefined && doc.src !== "" && `${basePath}/${doc.src}`);

    const imageRef = useRef<HTMLImageElement>(null);
    useEffect(() => {
        if (data && data.content) {
            let type = "image";
            const src = doc.src?.toLowerCase() ?? "";
            switch (src.substring(src.lastIndexOf(".") + 1)) {
                case "png": type = "image/png"; break;
                case "svg": type = "image/svg+xml"; break;
                case "jpg": type = "image/jpeg"; break;
            }

            const b64 = data.content;
            const dataUrl = "data:" + type + ";base64," +  b64;
            if (imageRef.current) {
                imageRef.current.src = dataUrl;
            }
        }
    }, [data, doc.src]);

    const fileRef = useRef<HTMLInputElement>(null);

    function selectFile(file: File) {
        const reader = new FileReader();
        reader.onload = async function() {
            const src = await githubUpload(appContext, basePath, file.name, reader.result as string);
            update({
                ...docRef.current,
                src,
            });
        };
        reader.readAsBinaryString(file);
    }

    function imageClick() {
        fileRef.current?.click();
    }

    function imageDragOver(event: React.DragEvent) {
        event.stopPropagation();
        event.preventDefault();
        if (event.nativeEvent.dataTransfer) {
            event.nativeEvent.dataTransfer.dropEffect = "copy";
        }
    }

    function imageDrop(event: React.DragEvent) {
        event.stopPropagation();
        event.preventDefault();
        if (event.nativeEvent.dataTransfer) {
            if (event.nativeEvent.dataTransfer.files.length !== 1)
                return;

            selectFile(event.nativeEvent.dataTransfer.files[0]);
        }
    }

    function fileChange() {
        if (fileRef.current?.files?.length !== 1)
            return;

        selectFile(fileRef.current?.files[0]);
    }

    return <>
        <div className={styles.figureWrapper}>
            <div className={styles.figureImage}>
                <button  onClick={imageClick} onDragOver={imageDragOver} onDrop={imageDrop}>
                    <img ref={imageRef} alt={doc.altText} width="250px" height="250px" src="/not-found.png"/>
                </button>
                <input type="file" ref={fileRef} className={styles.fileInput} onChange={fileChange} />
            </div>
            <div className={styles.figureCaption}>
                {doc.type === "figure" && <>
                    <h6>{figureNumber ? `Figure ${figureNumber}` : "Set ID to get a figure number"}</h6>
                    <ContentValueOrChildrenPresenter {...props} topLevel />
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
