import React from "react";
import { storiesOf } from "@storybook/react";

import { StartupErrorElement } from "./StartupError";

storiesOf("StartupError", module)
    .add("Generic error", () => <StartupErrorElement />)
    .add("Embedding error", () => <StartupErrorElement isInFrame />);
