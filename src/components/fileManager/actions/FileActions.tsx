import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownContent, DropdownItem } from "bloomer";
import { TiThMenu } from "react-icons/ti";

import "./FileActions.scss";
import ideStateStore from "stores/ideStateStore";
import materialsStore from "stores/materialsStore";
import projectStore from "stores/projectStore";
import { MaterialsFileType } from "types/enum";

interface FileActionsElementProps {
    isEntryFile: boolean;
    isIncludePath: boolean;
    isLocked: boolean;
    isOpen: boolean;
    onClickDelete: () => void;
    onClickMakeEntryFile: () => void;
    onClickMove: () => void;
    onClickRename: () => void;
    onClickDownload: () => void;
    onClickToggleIncludePath: () => void;
    onToggleOpen: ( open?: boolean ) => void;
    showEntryFileActions: boolean;
    showIncludePathActions: boolean;
}

export const FileActionsElement: React.FC<FileActionsElementProps> = ({
    isEntryFile,
    isIncludePath,
    isLocked,
    isOpen,
    onClickDelete,
    onClickDownload,
    onClickMakeEntryFile,
    onClickMove,
    onClickRename,
    onClickToggleIncludePath,
    onToggleOpen,
    showEntryFileActions,
    showIncludePathActions
}) => {
    // if the file is at the bottom of the page, use a dropup instead so that the menu fits on the page
    const [ isDropup, setDropup ] = useState( false );
    const ref = useRef<HTMLDivElement>( null );

    useEffect( () => {
        const { current } = ref;

        if( current ) {
            const { top, bottom } = current.getBoundingClientRect();
            const topCutoff = 150;
            const bottomCutoff = window.innerHeight - 150;

            if( top < topCutoff ) {
                setDropup( false );
            }
            else if( bottom > bottomCutoff ) {
                setDropup( true );
            }
        }
    });

    // prevent mouse clicks from propagating down – clicking on menu items would open the file otherwise!
    const stopPropagation = ( e: React.MouseEvent ): void => e.stopPropagation();

    return <div className="file-actions" onClick={stopPropagation} ref={ref}>
        {isOpen && <div className="file-actions-overlay" onClick={(): void => onToggleOpen( false )} />}
        <Dropdown isActive={isOpen} isAlign="right" className={isDropup ? "is-up" : ""}>
            <DropdownTrigger onClick={(): void => onToggleOpen()}>
                <TiThMenu />
            </DropdownTrigger>
            <DropdownMenu>
                <DropdownContent>
                    {!isLocked && <DropdownItem onClick={onClickMove}>
                        Move
                    </DropdownItem>}
                    {!isLocked && <DropdownItem onClick={onClickRename}>
                        Rename
                    </DropdownItem>}
                    {showEntryFileActions && !isEntryFile && <DropdownItem onClick={onClickMakeEntryFile} title="Make this the main file to pass to compiler">
                        Mark as entry file
                    </DropdownItem>}
                    {showIncludePathActions && <DropdownItem onClick={onClickToggleIncludePath}>
                        {isIncludePath ? "Remove from compilation" : "Include in compilation"}
                    </DropdownItem>}
                    <DropdownItem onClick={onClickDownload}>
                        Download
                    </DropdownItem>
                    {!isLocked && <DropdownItem onClick={onClickDelete}>
                        Delete
                    </DropdownItem>}
                </DropdownContent>
            </DropdownMenu>
        </Dropdown>
    </div>;
};

interface FileActionsProps {
    file: MaterialsFile;
    isEntryFile: boolean;   // don't suggest making this an entry file if it already is
    isLocked: boolean;      // if locked, user can't move, rename or delete the file
}

/**
 * Action button for files (rename, delete etc)
 */
const FileActions: React.FC<FileActionsProps> = observer( ({ file, isEntryFile, isLocked }) => {
    const [ isOpen, setOpen ] = useState( false );

    // helper function that closes the popup automatically when something is selected
    const doAction = ( action: () => void ) => (): void => {
        setOpen( false );
        action();
    };

    const onClickDelete = doAction( () => ideStateStore.openModal( "deleteFile", { file }) );
    const onClickDownload = doAction( () => materialsStore.download( file ) );
    const onClickMakeEntryFile = doAction( () => projectStore.setEntryFile( file ) );
    const onClickMove = doAction( () => ideStateStore.openModal( "moveFile", { file }) );
    const onClickRename = doAction( () => ideStateStore.openModal( "renameFile", { file }) );
    const onClickToggleIncludePath = doAction( () => materialsStore.toggleIncludePath( file ) );
    const onToggleOpen = ( open = true ): void => setOpen( open && !isOpen );
    const showEntryFileActions = projectStore.manager.showFilesystemCompilerOptions && file.type !== MaterialsFileType.folder;
    const showIncludePathActions = Boolean( projectStore.manager.showFilesystemCompilerOptions && file.type === MaterialsFileType.folder );

    return <FileActionsElement isEntryFile={isEntryFile}
                               isIncludePath={file.isIncludePath || false}
                               isLocked={isLocked}
                               isOpen={isOpen}
                               onClickDelete={onClickDelete}
                               onClickDownload={onClickDownload}
                               onClickMakeEntryFile={onClickMakeEntryFile}
                               onClickMove={onClickMove}
                               onClickRename={onClickRename}
                               onClickToggleIncludePath={onClickToggleIncludePath}
                               onToggleOpen={onToggleOpen}
                               showEntryFileActions={showEntryFileActions}
                               showIncludePathActions={showIncludePathActions} />;
});

export default FileActions;