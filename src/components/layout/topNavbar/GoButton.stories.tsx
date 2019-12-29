import React from "react";

import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { GoButtonElement } from "./GoButton";

storiesOf( "GoButton", module )
    .add( "neutral state", () => <GoButtonElement onClick={action( "onClick" )} /> )
    .add( "loading", () => <GoButtonElement loading onClick={action( "onClick while loading" )} /> );
