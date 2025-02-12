import React from "react";

import { storiesOf } from "@storybook/react";
import FullScreenLoader from "./FullScreenLoader";

storiesOf("FullScreenLoader", module)
    .addDecorator(storyFn => <div style={{ height: "500px" }}>{storyFn()}</div>)
    .add("With title", () => <FullScreenLoader title="Full Screen Loader" />)
    .add("Without title", () => <FullScreenLoader />);
