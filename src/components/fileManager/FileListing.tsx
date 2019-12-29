import React, { Fragment } from "react";
import { observer } from "mobx-react";
import materialsStore from "stores/materialsStore";
import { Menu, MenuList } from "bloomer";
import { MaterialsFileType } from "types/enum";
import FileItem from "./FileItem";

import "./FileListing.scss";
import editorStateStore from "stores/editorStateStore";

interface FileListingElementProps {
    files: MaterialsFile[];
    selected?: string;
}

export const FileListingElement: React.FC<FileListingElementProps> = observer( ({ files, selected }) => <MenuList>
    {files.map( file => {
        if( file.type === MaterialsFileType.folder && file.children && file.isOpen ) {
            return <Fragment key={file.id}>
                <FileItem file={file} />
                <FileListingElement files={file.children} selected={selected} />
            </Fragment>;
        }
        else {
            return <FileItem key={file.id} file={file} isActive={file.id === selected} />;
        }
    })}
</MenuList> );

/**
 *
 */
const FileListing: React.FC = observer( () => {
    const files = materialsStore.getFileTree();

    // FileListingElement is called recursively so <Menu> must be here
    return <Menu className="filelisting">
        <FileListingElement files={files} selected={editorStateStore.file.id} />
    </Menu>;
});

export default FileListing;