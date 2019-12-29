import React from "react";

import { storiesOf } from "@storybook/react";
import { CompilationProgressIndicatorElement } from "./CompilationProgressIndicator";
import { CompilationStage } from "stores/compilationResultStore";

storiesOf( "CompilationProgressIndicator", module )
    .add( "I7 0%", () => <CompilationProgressIndicatorElement percentage={0} stage={CompilationStage.firstPass} /> )
    .add( "I6 30%", () => <CompilationProgressIndicatorElement percentage={30} stage={CompilationStage.secondPass} /> )
    .add( "Upload 90%", () => <CompilationProgressIndicatorElement percentage={90} stage={CompilationStage.uploading} /> )
    .add( "Finished 100%", () => <CompilationProgressIndicatorElement percentage={100} stage={CompilationStage.finished} /> )
    .add( "I6 no percentage", () => <CompilationProgressIndicatorElement stage={CompilationStage.secondPass} /> )
    .add( "I6 failed at 30%", () => <CompilationProgressIndicatorElement percentage={30} stage={CompilationStage.secondPass} failed /> );
