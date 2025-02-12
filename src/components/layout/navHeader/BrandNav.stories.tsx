import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { BrandNavElement } from "./BrandNav";

const allTabs = {
    ideURL: "http://example.com/ide",
    publishingURL: "http://example.com/publishing",
    snippetsURL: "http://example.com/snippets"
};

const openInfoPage = action("Open info page");

storiesOf("BrandNav", module)
    .add("On IDE", () => (
        <BrandNavElement
            activeSite="ide"
            openInfoPage={openInfoPage}
            {...allTabs}
        />
    ))
    .add("On Snippets", () => (
        <BrandNavElement
            activeSite="snippets"
            openInfoPage={openInfoPage}
            {...allTabs}
        />
    ))
    .add("Only one link", () => (
        <BrandNavElement
            activeSite="snippets"
            ideURL="http://example.com/ide"
            openInfoPage={openInfoPage}
        />
    ))
    .add("Only two links", () => (
        <BrandNavElement
            activeSite="snippets"
            ideURL="http://example.com/ide"
            publishingURL="http://example.com/publishing"
            openInfoPage={openInfoPage}
        />
    ));
