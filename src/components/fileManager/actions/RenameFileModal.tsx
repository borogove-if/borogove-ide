import React, { useState } from "react";
import { observer } from "mobx-react";
import { Field, Label, Control, Input } from "bloomer";

import ModalTemplate, {
    cancelButton
} from "components/layout/modals/ModalTemplate";

import editorStateStore from "stores/editorStateStore";
import ideStateStore from "stores/ideStateStore";
import materialsStore, { MaterialsFileType } from "stores/materialsStore";
import routeStore from "stores/routeStore";

interface RenameFileModalElementProps {
    isFolder: boolean;
    oldName: string;
    onConfirm: (folderPath: string) => void;
}

export const RenameFileModalElement: React.FC<RenameFileModalElementProps> =
    observer(({ isFolder, oldName, onConfirm }) => {
        const [newName, setNewName] = useState(oldName);

        const buttons: ModalButton[] = [
            cancelButton,
            {
                color: "primary",
                label: "Rename",
                callback: (): void => onConfirm(newName)
            }
        ];

        return (
            <ModalTemplate
                buttons={buttons}
                header={`Rename ${isFolder ? "folder" : "file"}`}>
                <Field>
                    <Label>New name for &quot;{oldName}&quot;:</Label>
                    <Control>
                        <Input
                            type="text"
                            value={newName}
                            onChange={(
                                e: React.FormEvent<HTMLInputElement>
                            ): void =>
                                setNewName((e.target as HTMLInputElement).value)
                            }
                            autoFocus
                        />
                    </Control>
                </Field>
            </ModalTemplate>
        );
    });

interface RenameFileModalProps {
    file: MaterialsFile;
}

/**
 * Modal and form for moving a file
 */
const RenameFileModal: React.FC<RenameFileModalProps> = observer(({ file }) => {
    const isFolder = file.type === MaterialsFileType.folder;
    const oldName = file.displayName || file.name;
    const onConfirm = (newName: string): void => {
        const renamedFile = materialsStore.rename(file, newName);

        // If the file is open in the editor, change the URL to match.
        // Renaming a file changes its reference so we need to use the reference returned by the rename function.
        if (editorStateStore.file?.id === file.id) {
            routeStore.setFile(materialsStore.getPath(renamedFile));
        }
        ideStateStore.closeModal();
    };

    return (
        <RenameFileModalElement
            isFolder={isFolder}
            oldName={oldName}
            onConfirm={onConfirm}
        />
    );
});

export default RenameFileModal;
