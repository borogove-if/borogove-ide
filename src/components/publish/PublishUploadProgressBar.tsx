import React from "react";
import { observer } from "mobx-react";
import { Progress, Title, Columns, Column } from "bloomer";

import publishingStore from "stores/publishingStore";


interface PublishUploadProgressBarElementProps {
    progress: number;   // between 0 and 1
}

export const PublishUploadProgressBarElement: React.FC<PublishUploadProgressBarElementProps> = ({ progress }) => <div>
    <Title isSize={4}>Temporary file upload progress</Title>
    <Columns>
        <Column>
            <Progress value={progress} max={1} isColor={progress === 1 ? "success" : "primary"} />
        </Column>
        <Column>
            {Math.floor( progress * 100 )}%
        </Column>
    </Columns>
</div>;


/**
 * A progress bar for story file upload for Borogove.io publishing.
 */
const PublishUploadProgressBar: React.FC = observer( () => {
    return <PublishUploadProgressBarElement progress={publishingStore.uploadProgress} />;
});

export default PublishUploadProgressBar;
