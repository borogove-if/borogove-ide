import React from "react";
import { observer } from "mobx-react";

import ModalTemplate, {
    cancelButton
} from "components/layout/modals/ModalTemplate";

import ideStateStore from "stores/ideStateStore";
import filesystemStore, { MaterialsFileType } from "stores/materialsStore";

interface DeleteFileModalElementProps {
    isFolder: boolean;
    name: string;
    onConfirm: () => void;
}

export const DeleteFileModalElement: React.FC<DeleteFileModalElementProps> =
    observer(({ isFolder, name, onConfirm }) => {
        const buttons: ModalButton[] = [
            cancelButton,
            {
                color: "danger",
                label: "Delete",
                callback: onConfirm
            }
        ];

        return (
            <ModalTemplate
                buttons={buttons}
                header={`Delete ${isFolder ? "folder" : "file"}`}>
                Are you sure you want to delete the{" "}
                {isFolder ? "folder" : "file"} &quot;{name}&quot;?{" "}
                {isFolder && "All folder contents will be deleted! "}
                This action cannot be undone.
            </ModalTemplate>
        );
    });

interface DeleteFileModalProps {
    file: MaterialsFile;
}

/**
 * Modal that asks if the user really wants to delete a file (and triggers the delete action if they do)
 */
const DeleteFileModal: React.FC<DeleteFileModalProps> = observer(({ file }) => {
    const isFolder = file.type === MaterialsFileType.folder;
    const name = file.displayName || file.name;
    const onConfirm = (): void => {
        filesystemStore.deleteFile(file);
        ideStateStore.closeModal();
    };

    return (
        <DeleteFileModalElement
            isFolder={isFolder}
            name={name}
            onConfirm={onConfirm}
        />
    );
});

export default DeleteFileModal;
