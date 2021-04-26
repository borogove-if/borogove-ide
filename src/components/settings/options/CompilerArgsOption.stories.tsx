import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { CompilerArgsOptionElement } from "./CompilerArgsOption";

const options = [ "-f", "-l 1", "--ag=\"example\"" ];

storiesOf( "CompilerArgsOption", module )
    .add( "Compiler arguments", () => <CompilerArgsOptionElement options={options} onChange={action( "Value change" )} /> );
