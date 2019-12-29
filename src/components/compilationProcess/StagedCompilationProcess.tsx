import React from "react";
import { observer } from "mobx-react";
import { Section, Message, MessageHeader, MessageBody, Container } from "bloomer";

import compilationResultStore, { SpecialCompilationAction } from "stores/compilationResultStore";

import CompilationProgressIndicator from "./progressIndicator/CompilationProgressIndicator";
import CompilerOutput from "./CompilerOutput";

import "./StagedCompilationProcess.scss";
import CreateUUIDFileAction from "./CreateUUIDFileAction";

interface StagedCompilationProcessElementProps {
    resultsReport: string | null;
    specialAction: SpecialCompilationAction | null;
    success: boolean;
}

export const StagedCompilationProcessElement: React.FC<StagedCompilationProcessElementProps> = observer( ({ resultsReport, specialAction, success }) => {
    return <div>
        <CompilationProgressIndicator />
        {resultsReport && <Section id="i7-results-report">
            <Message id="compiler-status-container" isColor={success ? "primary" : "danger"}>
                <MessageHeader>
                    Compilation {success ? "succeeded" : "failed"}
                </MessageHeader>
                <MessageBody dangerouslySetInnerHTML={{ __html: resultsReport }} />
                {specialAction && <Container>
                    {specialAction === "createUUID" && <CreateUUIDFileAction />}
                </Container>}
            </Message>
        </Section>}
        <CompilerOutput />
    </div>;
});

/**
 * Shows the compilation process and results
 */
const StagedCompilationProcess: React.FC = observer( () => {
    const { resultsReport, specialAction, success } = compilationResultStore;
    return <StagedCompilationProcessElement resultsReport={resultsReport} specialAction={specialAction} success={success} />;
});

export default StagedCompilationProcess;