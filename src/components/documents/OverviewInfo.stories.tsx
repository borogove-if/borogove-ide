import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { OverviewInfoElement } from "./OverviewInfo";

const allURLs = {
    ideURL: "http://example.com/ide",
    publishingURL: "http://example.com/publishing",
    snippetsURL: "http://example.com/snippets"
};

storiesOf("Overview Info", module).add("Full page", () => (
    <OverviewInfoElement onClose={action("Close modal")} {...allURLs} />
));
