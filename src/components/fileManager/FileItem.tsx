import React from "react";
import { observer } from "mobx-react";
import { MenuLink } from "bloomer";

import ideStateStore from "stores/ideStateStore";
import materialsStore, { MaterialsFileType } from "stores/materialsStore";
import projectStore from "stores/projectStore";
import { TabContentType } from "stores/tabStore";

import { isMobileWidth } from "services/ide/environmentService";
import { openTab } from "services/ide/tabService";

import FolderName from "./FolderName";
import FileIcon from "./FileIcon";
import FileActions from "./actions/FileActions";

import "./FileItem.scss";


interface FileItemElementProps extends FileItemProps {
    isEntryFile: boolean;
    isIncludePath: boolean;
    isSortable: boolean;
    onClick: ( file: MaterialsFile ) => void;
    onSort: ( dir: 1 | -1 ) => void;
}

export const FileItemElement: React.FC<FileItemElementProps> = ({ file, isActive = false, isEntryFile, isFirst, isIncludePath, isLast, isSortable, onClick, onSort, readonly = false }) => {
    const { displayName, locked, name, type } = file;
    const isFolder = type === MaterialsFileType.folder;
    const classes = [ "file-item", "type-" + MaterialsFileType[type] ];

    if( file.isBinary ) {
        classes.push( "is-binary" );
    }

    if( isEntryFile ) {
        classes.push( "is-entry-file" );
    }

    if( isIncludePath ) {
        classes.push( "is-include-path" );
    }

    return <li className={classes.join( " " )}>
        <MenuLink isActive={isActive} onClick={(): void => onClick( file )}>
            <div className="material-file-name">
                <FileIcon file={file} />{" "}
                {isFolder ? <FolderName file={file} /> : ( displayName || name )}
            </div>
            <FileActions file={file}
                         isLocked={Boolean( locked )}
                         isEntryFile={isEntryFile}
                         isFirst={isFirst}
                         isLast={isLast}
                         isReadOnly={readonly}
                         isSortable={isSortable}
                         onSort={onSort} />
        </MenuLink>
    </li>;
};

interface FileItemProps {
    file: MaterialsFile;
    isActive?: boolean;
    isFirst: boolean;
    isLast: boolean;
    readonly?: boolean;
}

/**
 * Representation of one file in the file manager.
 */
const FileItem: React.FC<FileItemProps> = observer( ( props ) => {
    const onClick = ( file: MaterialsFile ): void => {
        switch( file.type ) {
            case MaterialsFileType.folder:
                materialsStore.toggleFolder( file );
                break;

            case MaterialsFileType.code:
            case MaterialsFileType.text:
                materialsStore.openFile( file );

                if( isMobileWidth() ) {
                    // close the file manager on mobile
                    ideStateStore.toggleFileManager();
                }
                break;

            case MaterialsFileType.audio:
            case MaterialsFileType.image:
                openTab( TabContentType.fileViewer, {
                    closable: true,
                    label: file.displayName || file.name,
                    props: { file }
                });
                break;

            default:
                // do nothing
        }
    };

    const { file } = props;
    const isSortable = projectStore.manager.orderedFiles;
    const isEntryFile = !isSortable && projectStore.entryFile ? file.id === projectStore.entryFile.id : false;
    const isIncludePath = Boolean( file.type === MaterialsFileType.folder && file.isIncludePath );

    return <FileItemElement onClick={onClick}
                            isEntryFile={isEntryFile}
                            isIncludePath={isIncludePath}
                            isSortable={isSortable}
                            onSort={( dir: 1 | -1 ): void => materialsStore.moveCompilationOrder( file, dir )}
                            {...props} />;
});

export default FileItem;
