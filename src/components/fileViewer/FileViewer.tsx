import React from "react";
import { observer } from "mobx-react";
import { Message, MessageBody } from "bloomer";

import { MaterialsFileType } from "types/enum";

import { readFileAsBase64 } from "services/filesystem/localFilesystemService";

import materialsStore from "stores/materialsStore";

import ViewImage from "./ViewImage";
import PlayAudio from "./PlayAudio";

import "./FileViewer.scss";


interface FileViewerElementProps {
    uri: string;   // data uri
    type: MaterialsFileType;
}

export const FileViewerElement: React.FC<FileViewerElementProps> = ({ uri, type }) => {
    const component = ( (): JSX.Element => {
        switch( type ) {
            case MaterialsFileType.image:
                return <ViewImage contents={uri} />;

            case MaterialsFileType.audio:
                return <PlayAudio contents={uri} />;

            default:
                // this should never be shown because the file manager doesn't open unknown types
                return <Message color="danger">
                    <MessageBody>
                        Can't view file of this type
                    </MessageBody>
                </Message>;
        }
    })();

    return <div className="file-viewer">
        {component}
    </div>;
};

interface FileViewerProps {
    file: MaterialsFile;
}

/**
 * Main handler for viewing a binary file. Determines the file type and opens a
 * corresponding viewer.
 */
const FileViewer: React.FC<FileViewerProps> = observer( ({ file }) => {
    if( !file ) {
        return null;
    }

    const contents = readFileAsBase64( materialsStore.getFilesystemPath( file ) );
    const uri = `data:application/octet-stream;base64,${contents}`;

    return <FileViewerElement uri={uri} type={file.type} />;
});

export default FileViewer;
