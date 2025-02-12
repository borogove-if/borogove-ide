import React from "react";
import { storiesOf } from "@storybook/react";

import { PublishReadyInfoElement } from "./PublishReadyInfo";

storiesOf("PublishReadyInfo", module).add("Info page", () => (
    <PublishReadyInfoElement publicationURL="http://example.com" />
));
