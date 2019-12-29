import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { LoggingNotificationElement } from "./LoggingNotification";

storiesOf( "LoggingNotification", module )
    .add( "Notification", () => <LoggingNotificationElement onDismiss={action( "Dismissed" )} openPrivacyPolicy={action( "Opening privacy policy" )} /> );