import React from "react";

import { storiesOf } from "@storybook/react";
import { ProjectIndexTabsElement } from "./ProjectIndexTabs";
import { action } from "@storybook/addon-actions";

storiesOf( "ProjectIndexTabs", module )
    .add( "6M62", () => <ProjectIndexTabsElement activeTab="Welcome" compilerVersion="6M62" onClickTab={action( "Tab clicked" )} /> )
    .add( "6G60", () => <ProjectIndexTabsElement activeTab="Welcome" compilerVersion="6G60" onClickTab={action( "Tab clicked" )} /> );
