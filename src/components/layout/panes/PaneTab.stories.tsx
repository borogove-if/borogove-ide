import React from "react";
import { TabList, Tabs } from "bloomer";

import { storiesOf } from "@storybook/react";
import { PaneTabElement } from "./PaneTab";
import { action } from "@storybook/addon-actions";

storiesOf( "PaneTab", module )
    .addDecorator( storyFn => <Tabs><TabList>{storyFn()}</TabList></Tabs> )
    .add( "Inactive", () => <PaneTabElement label="Test" onClick={action( "Clicked" )} /> )
    .add( "Active", () => <PaneTabElement label="Test" onClick={action( "Clicked" )} isActive /> )
    .add( "Closable", () => <PaneTabElement label="Test" onClick={action( "Clicked" )} isActive isClosable onClose={action( "Closing" )} /> );