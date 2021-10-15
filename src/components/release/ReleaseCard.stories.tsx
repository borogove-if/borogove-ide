import React from "react";

import { storiesOf } from "@storybook/react";
import { ReleaseCardElement } from "./ReleaseCard";
import { action } from "@storybook/addon-actions";

const buttonText = "Download";
const description = "Compile and download a game file. The players need a separate interpreter to play.";
const title = "Create a game file";

storiesOf( "ReleaseCard", module )
    .add( "Release card", () => <ReleaseCardElement buttonText={buttonText} onBuild={action( "Build" )} title={title}>{description}</ReleaseCardElement> );
