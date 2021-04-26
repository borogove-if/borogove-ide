import React from "react";
import { observer } from "mobx-react";

interface FolderNameProps {
    file: MaterialsFile;
}

/**
 * Text for a folder in the file manager
 */
const FolderName: React.FC<FolderNameProps> = observer( ({ file }) => {
    const { children, displayName, name } = file;
    const childrenCount = children ? children.length : 0;

    return <span>
        {displayName || name}
        <span title={`Contains ${childrenCount} files or folders`}>
            {` (${childrenCount})`}
        </span>
    </span>;
});

export default FolderName;
