import React from "react";
import { observer } from "mobx-react";
import { FileManagerElement } from "./FileManager";

/**
 * Shows the file manager in read-only mode
 */
const ReadOnlyFileManager: React.FC = observer(() => {
    return <FileManagerElement readonly />;
});

export default ReadOnlyFileManager;
