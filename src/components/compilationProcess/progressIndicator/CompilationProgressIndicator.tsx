import React from "react";
import { observer } from "mobx-react";
import CompilationProgressSegment from "./CompilationProgressSegment";
import compilationResultStore, {
    CompilationStage
} from "stores/compilationResultStore";

import "bulma-o-steps/bulma-steps.sass";
import { Content } from "bloomer";

interface CompilationProgressIndicatorElementProps {
    failed?: boolean;
    percentage?: number | null;
    stage: CompilationStage;
}

const stageDescriptions = [
    {
        stage: CompilationStage.uploading,
        header: "In transit",
        description: "Passing the source text to the compiler"
    },
    {
        stage: CompilationStage.firstPass,
        header: "Inform 7",
        description:
            "Turning the Inform 7 source text into intermediary Inform 6 code"
    },
    {
        stage: CompilationStage.secondPass,
        header: "Inform 6",
        description:
            "Compiling the intermediary Inform 6 code into a playable game file"
    },
    {
        stage: CompilationStage.results,
        header: "Results",
        description:
            "Collecting information about the generated files and resources"
    },
    {
        stage: CompilationStage.finished,
        header: "Finished",
        description: ""
    }
];

export const CompilationProgressIndicatorElement: React.FC<
    CompilationProgressIndicatorElementProps
> = ({ failed, percentage, stage }) => (
    <Content>
        <ul className="steps is-vertical">
            {stageDescriptions.map(s => (
                <CompilationProgressSegment
                    key={s.stage}
                    completed={
                        s.stage < stage || stage === CompilationStage.finished
                    }
                    failed={failed}
                    percentage={percentage}
                    isCurrentStage={s.stage === stage}
                    {...s}
                />
            ))}
        </ul>
    </Content>
);

/**
 * Builds the compilation indicator for I7 compilation
 */
const CompilationProgressIndicator: React.FC = observer(() => {
    const { percentage, stage, success } = compilationResultStore;
    return (
        <CompilationProgressIndicatorElement
            failed={!success}
            percentage={percentage}
            stage={stage}
        />
    );
});

export default CompilationProgressIndicator;
