import React from "react";

import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { TabKeyButtonElement } from "./TabKeyButton";

storiesOf("TabKeyButton", module)
    .add("active", () => <TabKeyButtonElement onClick={action("onClick")} />)
    .add("disabled", () => (
        <TabKeyButtonElement
            onClick={action("onClick while disabled")}
            disabled
        />
    ));
