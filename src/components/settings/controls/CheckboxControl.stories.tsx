import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { CheckboxControlElement } from "./CheckboxControl";

const contents = {
    description: "This is an example choice",
    label: "Test label",
    onChange: action( "Click" )
};

storiesOf( "CheckboxSetting", module )
    .add( "Checked", () => <CheckboxControlElement {...contents} checked /> )
    .add( "Unchecked", () => <CheckboxControlElement {...contents} /> );