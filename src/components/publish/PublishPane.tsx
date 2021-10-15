import React from "react";
import { observer } from "mobx-react";
import { Container } from "bloomer";

import PublishUploadProgressBar from "./PublishUploadProgressBar";
import PublishReadyInfo from "./PublishReadyInfo";
import PublishError from "./PublishError";

import publishingStore, { PublishingStage } from "stores/publishingStore";


interface PublishPaneElementProps {
    stage: PublishingStage;
}

export const PublishPaneElement: React.FC<PublishPaneElementProps> = ({ stage }) => {
    return <Container>
        <PublishUploadProgressBar />
        <hr />
        {stage === PublishingStage.finished && <PublishReadyInfo />}
        {stage === PublishingStage.error && <PublishError />}
    </Container>;
};


/**
 * Pane for publishing story files on Borogove.io
 */
const PublishPane: React.FC = observer( () => {
    return <PublishPaneElement stage={publishingStore.stage} />;
});

export default PublishPane;
