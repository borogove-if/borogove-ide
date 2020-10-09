import React, { useCallback } from "react";
import { observer } from "mobx-react";
import { useDropzone } from "react-dropzone";

import FileListing from "./FileListing";
import FileManagerMainActions from "./FileManagerMainActions";

import filesystemStore from "stores/materialsStore";

import "./FileManager.scss";

interface FileManagerElementProps {
    readonly?: boolean;
}

export const FileManagerElement: React.FC<FileManagerElementProps> = observer( ({ readonly = false }) => <div id="filemanager">
    <FileListing readonly={readonly} />
</div> );

/**
 * The entire file manager
 */
const FileManager: React.FC = observer( () => {
    const dropzoneSettings = {
        onDrop: useCallback( filesystemStore.uploadFiles, [] ),
        noClick: true
    };
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        open
    } = useDropzone( dropzoneSettings );

    return <section id="dropzone-container" {...getRootProps()}>
        <FileManagerMainActions uploadFiles={open} />
        <input {...getInputProps()} />
        {isDragActive && <div id="dropzone-drag-active-overlay">
            Drop files here to upload
        </div>}
        <FileManagerElement />
    </section>;
});

export default FileManager;