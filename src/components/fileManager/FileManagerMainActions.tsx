import React, { useState } from "react";
import { observer } from "mobx-react";
import { Dropdown, DropdownTrigger, Subtitle, DropdownMenu, DropdownContent, DropdownItem } from "bloomer";
import { TiArrowSortedDown } from "react-icons/ti";

import ideStateStore from "stores/ideStateStore";
import materialsStore from "stores/materialsStore";

import "./FileManagerMainActions.scss";

interface FileManagerMainActionsElementProps {
    isOpen: boolean;
    onClickDownloadProject: ( e: React.MouseEvent ) => void;
    onClickNewFolder: ( e: React.MouseEvent ) => void;
    onClickNewSource: ( e: React.MouseEvent ) => void;
    onClickUpload: ( e: React.MouseEvent ) => void;
    onToggleOpen: ( open?: boolean ) => void;
}

export const FileManagerMainActionsElement: React.FC<FileManagerMainActionsElementProps> = observer( ({ isOpen, onClickDownloadProject, onClickNewFolder, onClickNewSource, onClickUpload, onToggleOpen }) => {
    const stopPropagation = ( e: React.MouseEvent ): void => e.stopPropagation();

    return <div id="file-manager-main-actions" onClick={stopPropagation}>
        {isOpen && <div className="file-actions-overlay" onClick={(): void => onToggleOpen( false )} />}
        <Dropdown isActive={isOpen} isAlign="right">
            <DropdownTrigger onClick={(): void => onToggleOpen()}>
                <Subtitle aria-haspopup="true" aria-controls="dropdown-menu">
                    File Manager
                </Subtitle>
                <TiArrowSortedDown />
            </DropdownTrigger>
            <DropdownMenu>
                <DropdownContent>
                    <DropdownItem href="#" onClick={onClickNewSource}>
                        New source file
                    </DropdownItem>
                    <DropdownItem href="#" onClick={onClickNewFolder}>
                        New folder
                    </DropdownItem>
                    <DropdownItem href="#" onClick={onClickUpload} title="You can also drag and drop files on the file manager">
                        Upload files
                    </DropdownItem>
                    <DropdownItem href="#" onClick={onClickDownloadProject}>
                        Download project
                    </DropdownItem>
                </DropdownContent>
            </DropdownMenu>
        </Dropdown>
    </div>;
});


interface FileManagerMainActionsProps {
    uploadFiles: () => void;
}

/**
 * The dropdown for high-level file manager actions
 */
const FileManagerMainActions: React.FC<FileManagerMainActionsProps> = observer( ({ uploadFiles }) => {
    const [ isOpen, setOpen ] = useState( false );

    const doAction = ( action: () => void ) => ( e: React.MouseEvent ): void => {
        e.preventDefault();
        setOpen( false );
        action();
    };

    const onClickDownloadProject = doAction( materialsStore.downloadProject );
    const onClickNewFolder = doAction( () => ideStateStore.openModal( "addFile", { type: "folder" }) );
    const onClickNewSource = doAction( () => ideStateStore.openModal( "addFile", { type: "source file" }) );
    const onClickUpload = doAction( uploadFiles );

    const onToggleOpen = ( open = true ): void => setOpen( open && !isOpen );

    return <FileManagerMainActionsElement isOpen={isOpen}
                                          onClickDownloadProject={onClickDownloadProject}
                                          onClickNewFolder={onClickNewFolder}
                                          onClickNewSource={onClickNewSource}
                                          onClickUpload={onClickUpload}
                                          onToggleOpen={onToggleOpen} />;
});

export default FileManagerMainActions;