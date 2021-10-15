import React from "react";
import { storiesOf } from "@storybook/react";

import PublishError from "./PublishError";

storiesOf( "PublishError", module )
    .add( "Publishing error message", () => <PublishError /> );
