import React from "react";
import { observer } from "mobx-react";
import { Title, Section, Container } from "bloomer";

import compilationResultStore, { CompilationStage } from "stores/compilationResultStore";
import FullScreenLoader from "components/loader/FullScreenLoader";
import CompilerOutput from "./CompilerOutput";
import CompilationArtifacts from "./CompilationArtifacts";

interface SimpleCompilationProcessElementProps {
    failed: boolean;
    stage: CompilationStage;
}

export const SimpleCompilationProcessElement: React.FC<SimpleCompilationProcessElementProps> = observer( ({ failed, stage }) => {
    let state: "loading" | "failed" | "success";

    if( stage !== CompilationStage.finished ) {
        state = "loading";
    }
    else if( failed ) {
        state = "failed";
    }
    else {
        state = "success";
    }

    return <div>
        <Section>
            <Container id="compiler-status-container">
                {state === "loading" && <FullScreenLoader title="Compiling..." />}
                {state === "failed" && <Title className="title has-text-danger">Compilation failed</Title>}
                {state === "success" && <Title className="title has-text-success">Compilation finished</Title>}
            </Container>
        </Section>
        <CompilerOutput defaultOpen />
        <CompilationArtifacts />
    </div>;
});

/**
 * "Simple" compilation process (as opposed to Inform 7's multi-stage process)
 */
const SimpleCompilationProcess: React.FC = observer( () => {
    const { stage, success } = compilationResultStore;

    return <SimpleCompilationProcessElement failed={!success} stage={stage} />;
});

export default SimpleCompilationProcess;
