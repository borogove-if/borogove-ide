import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { PrivacyPolicyElement } from "./PrivacyPolicy";

storiesOf( "Privacy Policy", module )
    .add( "Full page", () => <PrivacyPolicyElement onClose={action( "Close modal" )} /> );
