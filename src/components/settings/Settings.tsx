import React from "react";
import { observer } from "mobx-react";
import { Container } from "bloomer";

import EditorOptions from "./options/EditorOptions";
import DataCollectionOptions from "./options/DataCollectionOptions";
import FileManagerOptions from "./options/FileManagerOptions";

/**
 * Main container for settings pane
 */
const Settings: React.FC = observer( () => {
    return <div>
        <Container>
            <EditorOptions />
            <FileManagerOptions />
            <DataCollectionOptions />
        </Container>
    </div>;
});

export default Settings;