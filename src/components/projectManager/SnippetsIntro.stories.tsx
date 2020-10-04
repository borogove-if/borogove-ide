import React from "react";

import { storiesOf } from "@storybook/react";
import { SnippetsIntroElement } from "./SnippetsIntro";

storiesOf( "SnippetsIntro", module )
    .add( "Intro text", () => <SnippetsIntroElement /> );