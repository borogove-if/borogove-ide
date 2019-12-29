import React, { useState } from "react";
import { observer } from "mobx-react";
import ModalTemplate, { cancelButton } from "components/layout/modals/ModalTemplate";
import { MaterialsFileType } from "types/enum";
import ideStateStore from "stores/ideStateStore";
import { Field, Label, Control, Select } from "bloomer";
import materialsStore from "stores/materialsStore";

interface MoveFileModalElementProps {
    isFolder: boolean;
    name: string;
    onConfirm: ( folderPath: string ) => void;
    targets: string[];
}

export const MoveFileModalElement: React.FC<MoveFileModalElementProps> = observer( ({ isFolder, name, onConfirm, targets }) => {
    const [ selectedPath, setSelectedPath ] = useState();

    const buttons: ModalButton[] = [
        cancelButton,
        {
            color: "primary",
            label: "Move",
            callback: (): void => onConfirm( selectedPath )
        }
    ];

    return <ModalTemplate buttons={buttons} header={`Move ${isFolder ? "folder" : "file"}`}>
        <Field>
            <Label>
                Choose a new folder for &quot;{name}&quot;:
            </Label>
            <Control>
                <Select onChange={( e: React.FormEvent<HTMLSelectElement> ): void => setSelectedPath( ( e.target as HTMLSelectElement ).value )}>
                    {targets.map( ( folder: string ) => <option key={folder} value={folder}>
                        {folder}
                    </option> )}
                </Select>
            </Control>
        </Field>
    </ModalTemplate>;
});


interface MoveFileModalProps {
    file: MaterialsFile;
}

/**
 * Modal and form for moving a file
 */
const MoveFileModal: React.FC<MoveFileModalProps> = observer( ({ file }) => {
    const isFolder = file.type === MaterialsFileType.folder;
    const name = file.displayName || file.name;
    const onConfirm = ( folderPath: string ): void => {
        materialsStore.moveToFolder( file, folderPath );
        ideStateStore.closeModal();
    };
    const targets = materialsStore.getAllFolderPaths();

    return <MoveFileModalElement isFolder={isFolder} name={name} onConfirm={onConfirm} targets={targets} />;
});

export default MoveFileModal;

