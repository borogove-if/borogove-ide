import React from "react";
import { Tabs, TabList } from "bloomer";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { FileManagerToggleButtonElement } from "./FileManagerToggleButton";

storiesOf( "FileManagerToggleButton", module )
    .addDecorator( storyFn => <Tabs><TabList>{storyFn()}</TabList></Tabs> )
    .add( "Inactive", () => <FileManagerToggleButtonElement onClick={action( "toggle" )} /> );
