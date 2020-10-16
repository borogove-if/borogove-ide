import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { SnippetReleaseInfoElement } from "./SnippetReleaseInfo";

const props = {
    onPublish: action( "Publish" ),
    url: "http://example.com/snptt"
};

storiesOf( "ReleaseSnippet", module )
    .add( "Loading", () => <SnippetReleaseInfoElement {...props} isLoading /> )
    .add( "Snippet published", () => <SnippetReleaseInfoElement {...props} /> )
    .add( "Save error", () => <SnippetReleaseInfoElement {...props} errorMessage="Unspecified error" /> )
    .add( "Dirty", () => <SnippetReleaseInfoElement {...props} isDirty /> );