import React from "react";

import { storiesOf } from "@storybook/react";
import { ShareLinkElement } from "./ShareLink";

storiesOf("ShareLink", module)
    .add("Share link", () => (
        <ShareLinkElement snippetId="abc123" language="inform7" />
    ))
    .add("Dirty", () => (
        <ShareLinkElement snippetId="abc123" language="inform7" isDirty />
    ));
