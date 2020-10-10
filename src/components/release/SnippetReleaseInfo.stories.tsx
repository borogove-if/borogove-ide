import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SnippetReleaseInfoElement } from "./SnippetReleaseInfo";

storiesOf( "ReleaseSnippet", module )
    .add( "Release a snippet", () => <SnippetReleaseInfoElement onPublish={action( "Publish" )} /> );