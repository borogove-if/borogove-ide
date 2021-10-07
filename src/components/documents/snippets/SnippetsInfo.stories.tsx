import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SnippetsInfoElement } from "./SnippetsInfo";

storiesOf( "SnippetsInfo", module )
    .add( "Snippets info tab", () => <SnippetsInfoElement flaggingUrl="http://example.com" onOpenPrivacyPolicy={action( "Open privacy policy" )} onOpenTOS={action( "Open TOS" )} /> );
