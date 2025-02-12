import React from "react";
import { observer } from "mobx-react";
import { Button, Container } from "bloomer";

import DataCollectionOptions from "./options/DataCollectionOptions";
import EditorOptions from "./options/EditorOptions";
import FileManagerOptions from "./options/FileManagerOptions";
import LanguageSpecificOptions from "./options/LanguageSpecificOptions";

import ideStateStore from "stores/ideStateStore";

/**
 * Main container for settings pane
 */
const Settings: React.FC = observer(() => {
    const openPrivacyPolicy = (): void => {
        ideStateStore.openModal("privacyPolicy");
    };

    return (
        <div>
            <Container>
                <LanguageSpecificOptions />
                <EditorOptions />
                <FileManagerOptions />
                <DataCollectionOptions />
                <Button isColor="text" onClick={openPrivacyPolicy}>
                    Privacy Policy
                </Button>
            </Container>
        </div>
    );
});

export default Settings;
