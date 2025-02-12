import React from "react";
import { observer } from "mobx-react";
import { Message, MessageHeader, MessageBody, Button, Delete } from "bloomer";

import settingsStore from "stores/settingsStore";
import ideStateStore from "stores/ideStateStore";

import "./LoggingNotification.scss";

export const LoggingNotificationElement: React.FC<LoggingNotificationProps> = ({
    onDismiss,
    openPrivacyPolicy
}) => (
    <Message id="logging-notification" isColor="info">
        <MessageHeader>
            Privacy Notification
            <Delete onClick={onDismiss} />
        </MessageHeader>
        <MessageBody>
            <p>
                We collect anonymous usage statistics and error logs. Read more
                and adjust your settings on the{" "}
                <a
                    href="#"
                    onClick={(e): void => {
                        e.preventDefault();
                        openPrivacyPolicy();
                    }}>
                    privacy policy page
                </a>
                . You can access the page later from the settings menu in the
                editor.
            </p>

            <div id="notification-footer">
                <Button onClick={onDismiss}>Understood</Button>
            </div>
        </MessageBody>
    </Message>
);

interface LoggingNotificationProps {
    onDismiss: () => void;
    openPrivacyPolicy: () => void;
}

/**
 * The notification informing the user about usage and error logging
 */
const LoggingNotification: React.FC = observer(() => {
    const onDismiss = (): void => {
        settingsStore.saveSetting(
            "transient",
            "showLoggingNotification",
            false
        );
    };

    const openPrivacyPolicy = (): void => {
        ideStateStore.openModal("privacyPolicy");
    };

    return (
        <LoggingNotificationElement
            onDismiss={onDismiss}
            openPrivacyPolicy={openPrivacyPolicy}
        />
    );
});

export default LoggingNotification;
