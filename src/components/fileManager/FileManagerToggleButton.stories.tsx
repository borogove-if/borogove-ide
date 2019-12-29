import React from "react";

import { storiesOf } from "@storybook/react";
import { FileManagerToggleButtonElement } from "./FileManagerToggleButton";
import { action } from "@storybook/addon-actions";
import { Tabs, TabList } from "bloomer";

storiesOf( "FileManagerToggleButton", module )
    .addDecorator( storyFn => <Tabs><TabList>{storyFn()}</TabList></Tabs> )
    .add( "Inactive", () => <FileManagerToggleButtonElement onClick={action( "toggle" )} /> );