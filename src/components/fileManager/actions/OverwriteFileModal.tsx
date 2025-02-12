import React, { useState } from "react";
import { observer } from "mobx-react";
import { Field, Control, Checkbox } from "bloomer";

import ideStateStore from "stores/ideStateStore";

import ModalTemplate, {
    cancelButton
} from "components/layout/modals/ModalTemplate";

interface OverwriteFileModalElementProps {
    filename: string;
    onCancel: () => void;
    onConfirm: (alwaysOverwrite: boolean) => void;
}

export const OverwriteFileModalElement: React.FC<OverwriteFileModalElementProps> =
    observer(({ filename, onCancel, onConfirm }) => {
        const [alwaysOverwrite, setAlwaysOverwrite] = useState(false);

        const buttons: ModalButton[] = [
            cancelButton,
            {
                color: "primary",
                label: "Overwrite",
                callback: (): void => onConfirm(alwaysOverwrite)
            }
        ];

        return (
            <ModalTemplate
                buttons={buttons}
                cancelCallback={onCancel}
                header="Overwrite file?">
                <p>{filename} already exists. Overwrite existing file?</p>
                <Field>
                    <Control>
                        <Checkbox
                            checked={alwaysOverwrite}
                            onChange={(): void =>
                                setAlwaysOverwrite(!alwaysOverwrite)
                            }>
                            {" "}
                            Always overwrite files
                        </Checkbox>
                    </Control>
                </Field>
            </ModalTemplate>
        );
    });

interface OverwriteFileModalProps {
    filename: string;
    onCancel: () => void;
    onConfirm: () => void;
}

/**
 * Asking the user if they want to overwrite a file
 */
const OverwriteFileModal: React.FC<OverwriteFileModalProps> = observer(
    ({ filename, onCancel, onConfirm }) => {
        const action =
            (
                callback: (argument?: boolean) => void
            ): ((argument?: boolean) => void) =>
            (argument): void => {
                ideStateStore.closeModal();
                callback(argument);
            };

        return (
            <OverwriteFileModalElement
                onConfirm={action(onConfirm)}
                onCancel={action(onCancel)}
                filename={filename}
            />
        );
    }
);

export default OverwriteFileModal;
