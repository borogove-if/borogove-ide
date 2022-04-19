import React, { useState } from "react";
import { observer } from "mobx-react";
import { Message, MessageBody, Container } from "bloomer";

import ProjectIndexTabs from "./ProjectIndexTabs";

import compilationResultStore from "stores/compilationResultStore";
import projectStore from "stores/projectStore";

import "./ProjectIndex.scss";

/**
 * Shows the Inform 7 index.
 */
const ProjectIndex: React.FC = observer( () => {
    const url = compilationResultStore.indexUrl;
    const [ page, setPage ] = useState( projectStore.compilerVersion === "6G60" ? "Contents" : "Welcome" );

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
