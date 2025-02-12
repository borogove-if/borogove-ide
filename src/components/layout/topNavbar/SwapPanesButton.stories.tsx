import React from "react";

import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { SwapPaneOption, SwapPanesButtonElement } from "./SwapPanesButton";

storiesOf("SwapPanesButton", module)
    .add("code", () => (
        <SwapPanesButtonElement
            otherPane={SwapPaneOption.code}
            onClick={action("onClick")}
        />
    ))
    .add("play", () => (
        <SwapPanesButtonElement
            otherPane={SwapPaneOption.play}
            onClick={action("onClick")}
        />
    ))
    .add("disabled", () => (
        <SwapPanesButtonElement
            otherPane={SwapPaneOption.code}
            onClick={action("onClick while disabled")}
            disabled
        />
    ));
