import React, { ReactNode } from "react";
import { observer } from "mobx-react";
import {
    Button,
    Modal,
    ModalBackground,
    ModalCard,
    ModalCardBody,
    ModalCardFooter,
    ModalCardHeader,
    ModalClose
} from "bloomer";

import ideStateStore from "stores/ideStateStore";

import "./ModalTemplate.scss";

export const cancelButton: ModalButton = {
    color: "light",
    isCancel: true,
    label: "Cancel"
};

export const okButton: ModalButton = {
    color: "primary",
    isCancel: false,
    label: "OK"
};

const defaultButtons: ModalButton[] = [cancelButton, okButton];

interface ModalTemplateProps {
    buttons?: ModalButton[];
    callbacks?: Array<() => void>;
    cancelCallback?: () => void;
    children?: ReactNode;
    header: string;
    okCallback?: () => void;
    wide?: boolean;
}

/**
 *
 */
const ModalTemplate: React.FC<ModalTemplateProps> = observer(
    ({
        buttons = defaultButtons,
        callbacks = [],
        cancelCallback,
        children,
        header,
        okCallback,
        wide = false
    }) => {
        const onCancel = cancelCallback || ideStateStore.closeModal;

        return (
            <Modal isActive>
                <ModalBackground />
                <ModalCard className={wide ? "is-wide" : ""}>
                    <ModalCardHeader>{header}</ModalCardHeader>
                    <ModalCardBody>{children}</ModalCardBody>
                    <ModalCardFooter>
                        {buttons.map((button: ModalButton, i: number) => {
                            const onClick = button.isCancel
                                ? onCancel
                                : button.callback || callbacks[i] || okCallback;
                            return (
                                <Button
                                    key={button.label}
                                    isColor={button.color}
                                    onClick={onClick}>
                                    {button.label}
                                </Button>
                            );
                        })}
                    </ModalCardFooter>
                </ModalCard>
                <ModalClose onClick={onCancel} />
            </Modal>
        );
    }
);

export default ModalTemplate;
