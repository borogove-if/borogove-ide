import React from "react";
import { storiesOf } from "@storybook/react";

import { PublishUploadProgressBarElement } from "./PublishUploadProgressBar";

storiesOf( "PublishingUploadProgressBar", module )
    .add( "0%", () => <PublishUploadProgressBarElement progress={0} /> )
    .add( "1%", () => <PublishUploadProgressBarElement progress={0.01} /> )
    .add( "10%", () => <PublishUploadProgressBarElement progress={0.1} /> )
    .add( "25%", () => <PublishUploadProgressBarElement progress={0.25} /> )
    .add( "50%", () => <PublishUploadProgressBarElement progress={0.5} /> )
    .add( "80%", () => <PublishUploadProgressBarElement progress={0.8} /> )
    .add( "99%", () => <PublishUploadProgressBarElement progress={0.99} /> )
    .add( "100%", () => <PublishUploadProgressBarElement progress={1} /> );
