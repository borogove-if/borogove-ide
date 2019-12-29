import React from "react";

import { storiesOf } from "@storybook/react";
import { TextInputControlElement } from "./TextInputControl";

storiesOf( "TextInputControl", module )
    .add( "Text input", () => <TextInputControlElement value="Test input"
                                                       description="Here's a description of the setting"
                                                       label="Text input option" /> )
    .add( "No description", () => <TextInputControlElement value="Test input"
                                                           label="Text input option" /> );