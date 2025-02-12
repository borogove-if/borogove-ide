import React from "react";
import { observer } from "mobx-react";
import { Button } from "bloomer";
import { TiFolder } from "react-icons/ti";

import ideStateStore from "stores/ideStateStore";

import "./FileManagerToggleButton.scss";

interface FileManagerToggleButtonElementProps {
    onClick: () => void;
}

export const FileManagerToggleButtonElement: React.FC<
    FileManagerToggleButtonElementProps
> = ({ onClick }) => (
    <Button id="file-manager-toggle" isColor="text" onClick={onClick}>
        <TiFolder />
    </Button>
);

/**
 * The button in the left tab bar that toggles the file manager.
 */
const FileManagerToggleButton: React.FC = observer(() => {
    const toggleFilemanager = (): void => {
        ideStateStore.toggleFileManager();
    };

    return <FileManagerToggleButtonElement onClick={toggleFilemanager} />;
});

export default FileManagerToggleButton;
