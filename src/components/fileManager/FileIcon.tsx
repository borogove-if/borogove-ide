import React from "react";
import { observer } from "mobx-react";
import { MaterialsFileType } from "types/enum";
import { TiFolderOpen, TiFolder, TiDocument } from "react-icons/ti";


interface FileIconProps {
    file: MaterialsFile;
}

/**
 * Icons for file/folder types
 */
const FileIcon: React.FC<FileIconProps> = observer( ({ file }) => {
    switch( file.type ) {
        case MaterialsFileType.folder:
            if( file.isOpen ) {
                return <TiFolderOpen /> ;
            }
            return <TiFolder />;

        default:
            return <TiDocument />;
    }
});

export default FileIcon;