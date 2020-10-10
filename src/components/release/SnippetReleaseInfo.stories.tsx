import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SnippetReleaseInfoElement } from "./SnippetReleaseInfo";

storiesOf( "ReleaseSnippet", module )
    .add( "Loading", () => <SnippetReleaseInfoElement snippetId="snppt" onPublish={action( "Publish" )} isLoading /> )
    .add( "Snippet published", () => <SnippetReleaseInfoElement snippetId="snppt" onPublish={action( "Publish" )} /> )
    .add( "Dirty", () => <SnippetReleaseInfoElement snippetId="snppt" onPublish={action( "Publish" )} isDirty /> );