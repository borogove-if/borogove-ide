import React, { useState } from "react";
import { observer } from "mobx-react";

import compilationResultStore from "stores/compilationResultStore";
import ProjectIndexTabs from "./ProjectIndexTabs";

import "./ProjectIndex.scss";
import { Message, MessageBody, Container } from "bloomer";

/**
 * Shows the Inform 7 index.
 */
const ProjectIndex: React.FC = observer( () => {
    const url = compilationResultStore.indexUrl;
    const [ page, setPage ] = useState( "Welcome" );

    if( !url ) {
        return <Container>
            <Message isColor="info">
                <MessageBody>
                   Index will be available after the project has been compiled successfully.
                </MessageBody>
            </Message>
        </Container>;
    }

    return <div id="index-container">
        <ProjectIndexTabs activeTab={page} onClickTab={setPage} />
        <iframe src={`${url}${page}.html`} />
    </div>;
});

export default ProjectIndex;