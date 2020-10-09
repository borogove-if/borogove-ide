import React, { Fragment } from "react";
import { observer } from "mobx-react";
import { Menu, MenuList } from "bloomer";

import FileItem from "./FileItem";

import materialsStore from "stores/materialsStore";
import editorStateStore from "stores/editorStateStore";
import { MaterialsFileType } from "types/enum";

import "./FileListing.scss";

interface FileListingElementProps {
    files: MaterialsFile[];
    readonly?: boolean;
    selected?: string;
}

export const FileListingElement: React.FC<FileListingElementProps> = observer( ({ files, readonly, selected }) => <MenuList>
    {files.map( file => {
        if( file.type === MaterialsFileType.folder && file.children && file.isOpen ) {
            return <Fragment key={file.id}>
                <FileItem file={file} readonly={readonly} />
                <FileListingElement files={file.children} selected={selected} readonly={readonly} />
            </Fragment>;
        }
        else {
            return <FileItem key={file.id} file={file} isActive={file.id === selected} readonly={readonly} />;
        }
    })}
</MenuList> );

interface FileListingProps {
    readonly?: boolean;
}

/**
 * List of files in the file manager
 */
const FileListing: React.FC<FileListingProps> = observer( ({ readonly }) => {
    const files = materialsStore.getFileTree();

    // FileListingElement is called recursively so <Menu> must be here
    return <Menu className="filelisting">
        <FileListingElement files={files} readonly={readonly} selected={editorStateStore.file.id} />
    </Menu>;
});

export default FileListing;