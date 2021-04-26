import React from "react";

import { storiesOf } from "@storybook/react";
import { ProjectLoadingErrorElement } from "./ProjectLoadingError";
import { action } from "@storybook/addon-actions";

storiesOf( "ProjectLoadingError", module )
    .add( "Loading error", () => <ProjectLoadingErrorElement onRetry={action( "Retry" )} /> );
