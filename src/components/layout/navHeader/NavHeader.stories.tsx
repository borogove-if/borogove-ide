import React from "react";

import { storiesOf } from "@storybook/react";
import { NavHeaderElement } from "./NavHeader";

storiesOf("NavHeader", module)
    .add("Project Manager", () => <NavHeaderElement title="Project Manager" />)
    .add("Snippets", () => <NavHeaderElement title="Snippets" />);
