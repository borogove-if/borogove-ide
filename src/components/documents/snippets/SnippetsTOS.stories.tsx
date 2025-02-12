import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SnippetsTOSElement } from "./SnippetsTOS";

storiesOf("SnippetsTOS", module).add("Terms of Service", () => (
    <SnippetsTOSElement onClose={action("close")} />
));
