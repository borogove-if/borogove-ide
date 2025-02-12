import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { TextInputControlElement } from "./TextInputControl";

storiesOf("TextInputControl", module)
    .add("Text input", () => (
        <TextInputControlElement
            value="Test input"
            description="Here's a description of the setting"
            label="Text input option"
            onChange={action("Click")}
        />
    ))
    .add("No description", () => (
        <TextInputControlElement
            value="Test input"
            label="Text input option"
            onChange={action("Click")}
        />
    ))
    .add("Reset", () => (
        <TextInputControlElement
            value="Test input"
            label="Text input option"
            resetValue="Original value"
            onChange={action("Click")}
        />
    ))
    .add("Multiline", () => (
        <TextInputControlElement
            value={"Test input\nLine 2"}
            label="Text input option"
            onChange={action("Click")}
            multiline
        />
    ))
    .add("Multiline with reset", () => (
        <TextInputControlElement
            value={"Test input\nLine 2"}
            label="Text input option"
            resetValue="Original value"
            onChange={action("Click")}
            multiline
        />
    ));
