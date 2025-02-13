import React, { useState } from "react";
import { observer } from "mobx-react";
import { join } from "path";
import { Field, Label, Control, Select, Input } from "bloomer";

import ModalTemplate, {
    cancelButton
} from "components/layout/modals/ModalTemplate";

import ideStateStore from "stores/ideStateStore";
import materialsStore from "stores/materialsStore";
import routeStore from "stores/routeStore";

interface AddFileModalElementProps extends AddFileModalProps {
    folders: string[];
    onConfirm: (name: string, folderPath: string) => void;
}

export const AddFileModalElement: React.FC<AddFileModalElementProps> = observer(
    ({ folders, onConfirm, type }) => {
        const [filename, setFilename] = useState("");
        const [selectedPath, setSelectedPath] = useState("/");

        const buttons: ModalButton[] = [
            cancelButton,
            {
                color: "primary",
                label: "Create",
                callback: (): void => onConfirm(filename, selectedPath)
            }
        ];

        return (
            <ModalTemplate buttons={buttons} header={`New ${type}`}>
                <Field>
                    <Label>Name of the new {type}</Label>
                    <Control>
                        <Input
                            value={filename}
                            onChange={(
                                e: React.FormEvent<HTMLInputElement>
                            ): void =>
                                setFilename(
                                    (e.target as HTMLInputElement).value
                                )
                            }
                            autoFocus
                            required
                        />
                    </Control>
                </Field>
                {folders.length > 1 && (
                    <Field>
                        <Label>Parent folder</Label>
                        <Control>
                            <Select
                                onChange={(
                                    e: React.FormEvent<HTMLSelectElement>
                                ): void =>
                                    setSelectedPath(
                                        (e.target as HTMLSelectElement).value
                                    )
                                }>
                                {folders.map((folder: string) => (
                                    <option key={folder} value={folder}>
                                        {folder}
                                    </option>
                                ))}
                            </Select>
                        </Control>
                    </Field>
                )}
            </ModalTemplate>
        );
    }
);

interface AddFileModalProps {
    type: "source file" | "folder";
}

/**
 * Modal and form for moving a file
 */
const AddFileModal: React.FC<AddFileModalProps> = observer(({ type }) => {
    const onConfirm = (name: string, folderPath: string): void => {
        let file;

        if (type === "source file") {
            const parent = materialsStore.addFolder(folderPath);
            file = materialsStore.addMaterialsFile("", { name, parent });
            routeStore.setFile(file.name);
        } else {
            file = materialsStore.addFolder(join(folderPath || "/", name));
            materialsStore.openFile(file);
        }

        ideStateStore.closeModal();
    };
    const folders = materialsStore.getAllFolderPaths();

    return (
        <AddFileModalElement
            folders={folders}
            onConfirm={onConfirm}
            type={type}
        />
    );
});

export default AddFileModal;
