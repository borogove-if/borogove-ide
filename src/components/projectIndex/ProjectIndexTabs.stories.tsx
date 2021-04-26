import React from "react";

import { storiesOf } from "@storybook/react";
import { ProjectIndexTabsElement } from "./ProjectIndexTabs";
import { action } from "@storybook/addon-actions";

storiesOf( "ProjectIndexTabs", module )
    .add( "Tabs", () => <ProjectIndexTabsElement activeTab="Welcome" onClickTab={action( "Tab clicked" )} /> );
