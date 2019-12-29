import React from "react";

import { storiesOf } from "@storybook/react";
import MainNavigation from "./MainNavigation";
import "./MainNavigation.scss";

storiesOf( "MainNavigation", module )
    .add( "neutral state", () => <MainNavigation /> );
