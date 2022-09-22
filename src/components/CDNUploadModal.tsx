import React, {LegacyRef, useContext, useEffect, useMemo, useRef, useState} from "react";
import {Button, Input, Row, Modal, ModalBody, ModalFooter, ModalHeader, Col, Alert} from "reactstrap";
import {AppContext} from "../App";
import {contentsPath, githubCreate, GitHubRepository} from "../services/github";
import {components, GroupBase, InputActionMeta, SingleValue} from "react-select";
import useSWR from "swr";
import CreatableSelect from "react-select/creatable";
import {isDefined} from "../utils/types";

export const defaultCdn = {
    open: false,
    toggle: (() => {
        throw new Error("cdn.toggle called outside AppContext");
    }) as () => void,
};

interface GitHubOption {
    type: "dir" | "file",
    label: string;
    value: string;
}
const AlwaysVisibleInput = (props: any) => <components.Input {...props} isHidden={false} />;

interface GitHubDirInputProps {
    repo: GitHubRepository;
    className: string;
    dir: string | undefined;
    setDir: (newDir: string | undefined) => void;
    invalid?: boolean;
}
const GitHubDirInput = ({repo, className, dir, setDir, invalid}: GitHubDirInputProps) => {

    // Hacking react-select to do sensible things reading list:
    //  - https://github.com/JedWatson/react-select/issues/1558#issuecomment-738880505
    //  - https://github.com/JedWatson/react-select/discussions/4302
    //  - https://stackoverflow.com/questions/51951379/how-do-i-implement-field-validation-for-react-select

    const appContext = useContext(AppContext);
    const [pathOption, setPathOption] = useState<GitHubOption | null>();
    const searchablePathPart = dir ? dir.split("/").length === 0 ? dir : dir.split("/").slice(0, -1).join("/") : "";

    const {data, isValidating, error} = useSWR(contentsPath(searchablePathPart ?? "", appContext.github.branch, repo));

    const pathOptions: GroupBase<GitHubOption>[] = useMemo(() => {
        return (error || !data) ? [] : [{
            options: data?.type === "file" ? {value: data.path, label: data.path, isDisabled: true} : data?.map((d: any) => ({value: d.path, label: d.path, isDisabled: d.type === "file"})) ?? [],
            label: "Existing directories"
        }];
    }, [error, data]);

    const formatCreateLabel = (path: string) => `Create directory "${path.replace(/\/$/, "")}"`;

    const onInputChange = (inputValue: string, { action }: InputActionMeta) => {
        // onBlur => setInputValue to last selected value
        if (action === "input-blur") {
            setDir(pathOption ? pathOption.value : "");
        }
        // onInputChange => update inputValue
        else if (action === "input-change") {
            setDir(inputValue);
        }
    };

    const onChange = (option: SingleValue<GitHubOption>) => {
        setPathOption(option);
        setDir(option ? option.value : "");
    };

    const getBasePath = (path: string) => {
        return path.replace(/\/[^/]*$/, "");
    };

    return <CreatableSelect
        className={className}
        isLoading={isValidating}
        value={pathOption}
        tabSelectsValue
        onChange={onChange}
        inputValue={dir}
        isClearable
        onInputChange={onInputChange}
        controlShouldRenderValue={false}
        components={{
            Input: AlwaysVisibleInput
        }}
        isValidNewOption={(path, value, options ) => {
            if (path === "") return false;
            if (path.match(/^[a-zA-Z0-9_\-/]+$/) === null) return false;
            const pathToSearch = path.replace(/\/$/, "");
            return !options.find(o => "value" in o ? [o.value, getBasePath(o.value)].includes(pathToSearch) : o.options.find(_o => [_o.value, getBasePath(_o.value)].includes(pathToSearch)))
        }}
        styles={{
            control: (base, state) => ({
                ...base,
                // state.isFocused can display different borderColor if you need it
                borderColor: !invalid ? '#ddd' : 'red',
                // overwrittes hover style
                '&:hover': {
                    borderColor: !invalid ? '#ddd' : 'red'
                }
            })
        }}
        options={pathOptions}
        placeholder={"Choose a directory..."}
        createOptionPosition={"first"}
        formatCreateLabel={formatCreateLabel}
    />;
}

const validateFile: (file: File | undefined) => ({isValid: true, error?: undefined} | {isValid?: undefined, error: string}) = (file: File | undefined) => {
    if (!file) return {error: "File doesn't exist"};
    if (file.size >= 90_000_000) return {error: "File is too big: it must be smaller than 90Mb"};
    if (file?.name.split(".").length !== 2) return {error: "File path must consist of a name, followed by an extension"};
    const fileName = file?.name.split(".")[0];
    const fileExt = file?.name.split(".")[1]; // TODO might be good to have a whitelist of file extensions at some point?
    if (fileName.match(/^[a-zA-Z0-9_-]+$/) === null) return {error: "File name is invalid: it can only contain alphanumeric characters, dashes and underscores"};
    return {isValid: true};
};

const validateDir: (dir: string | undefined) => ({isValid: true, error?: undefined} | {isValid?: undefined, error: string}) = (dir: string | undefined) => {
    if (!isDefined(dir)) return {error: "Please specify a directory"};
    if (dir === "") return {error: "Please do not upload files to the top level directory"};
    if (dir.match(/^[a-zA-Z0-9_\-/]+$/) === null) return {error: "Directory is invalid: directory names can only contain alphanumeric characters, dashes and underscores"};
    return {isValid: true};
};

export const CDNUploadModal = () => {
    const appContext = useContext(AppContext);
    const {cdn: {open, toggle}, github} = appContext;

    const [file, setFile] = useState<File>();
    const [dir, setDir] = useState<string>();
    const [successNotification, setSuccessNotification] = useState<string | undefined>();

    const path = dir && file?.name ? dir.replace(/\/$/, "") + "/" + file.name : undefined;
    const fileIsValid = validateFile(file);
    const dirIsValid = validateDir(dir);

    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (file !== undefined) setSuccessNotification(undefined);
    }, [path, file]);

    const {data, isValidating, error} = useSWR(path ? contentsPath(path, github.branch, "cdn") : null);
    const githubPathInvalid = !error && (data && data.type === "file"); // invalid if file already exists in github

    const uploadToCDN = async () => {
        if (!file || !dir) return;
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                await githubCreate(appContext, dir, file.name, reader.result as string, "cdn");
                setSuccessNotification(`Successfully uploaded file ${path}`);
                setFile(undefined);
                if (fileInput.current) fileInput.current.value = "";
            } catch (e) {
                alert("Couldn't upload file to CDN. Perhaps it already exists.");
                console.error("Couldn't upload file to CDN. Perhaps it already exists.", e);
            }
        }
        reader.readAsBinaryString(file);
    }

    return <Modal isOpen={open} toggle={toggle}>
        <ModalHeader>
            Upload to CDN
        </ModalHeader>
        <ModalBody>
            <Input innerRef={fileInput} className={"mb-2"} type={"file"} name={"file"} onChange={e => setFile(e?.target?.files?.[0] ?? undefined)} />
            {fileIsValid.isValid
                ? <>
                    {file && <GitHubDirInput className={"mb-2"} repo={"cdn"} dir={dir} setDir={setDir} invalid={githubPathInvalid} />}
                    {file && path && <div>
                        Path: <code>{path}</code>
                    </div>}
                    {(!dirIsValid.isValid || githubPathInvalid) && <small className={"text-danger"}>{dirIsValid.error ?? "Cannot upload file, one already exists with that name!"}</small>}
                </>
                : (file ? <small className={"text-danger"}>{fileIsValid.error}</small> : <small>Please select a file</small>)
            }
            {successNotification && <Alert className={"mt-2"} color={"success"}>
                {successNotification}
            </Alert>}
        </ModalBody>
        <ModalFooter>
            <Row className={"w-100 justify-content-end"}>
                {file && path && !githubPathInvalid && dirIsValid.isValid && <Col xs={8}>
                    <Button color={"success"} className={"w-100"} onClick={uploadToCDN}>
                        Upload
                    </Button>
                </Col>}
                <Col xs={4}>
                    <Button color={"secondary"} className={"w-100"} onClick={toggle}>
                        Close
                    </Button>
                </Col>
            </Row>
        </ModalFooter>
    </Modal>;
}
