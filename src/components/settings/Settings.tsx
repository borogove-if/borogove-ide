import React from "react";
import { observer } from "mobx-react";
import { Button, Container } from "bloomer";

import EditorOptions from "./options/EditorOptions";
import DataCollectionOptions from "./options/DataCollectionOptions";
import FileManagerOptions from "./options/FileManagerOptions";

import ideStateStore from "stores/ideStateStore";

/**
 * Main container for settings pane
 */
const Settings: React.FC = observer( () => {
    const openPrivacyPolicy = (): void => {
        ideStateStore.openModal( "privacyPolicy" );
    };

    return <div>
        <Container>
            <EditorOptions />
            <FileManagerOptions />
            <DataCollectionOptions />
            <Button isColor="text" onClick={openPrivacyPolicy}>
                Privacy Policy
            </Button>
        </Container>
    </div>;
});

export default Settings;
