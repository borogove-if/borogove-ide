import React from "react";
import { observer } from "mobx-react";
import { Button, Title } from "bloomer";

import publishingStore from "stores/publishingStore";

interface PublishReadyInfoElementProps {
    publicationURL: string;
}

export const PublishReadyInfoElement: React.FC<
    PublishReadyInfoElementProps
> = ({ publicationURL }) => (
    <section>
        <Title>Ready to Publish</Title>

        <p>
            The story file has been compiled and uploaded to a temporary
            location. You can now proceed to Borogove.io using the button below
            and get a permanent link to a playable online version. You will be
            asked to log in using a Google account.
        </p>

        <p>
            If you don't complete the process, the uploaded file will be deleted
            within few hours.
        </p>

        <p>
            <Button href={publicationURL}>Continue to Borogove.io</Button>
        </p>
    </section>
);

/**
 * Instructions for how to continue with Borogove.io publishing after the story file has been uploaded.
 */
const PublishReadyInfo: React.FC = observer(() => {
    return (
        <PublishReadyInfoElement publicationURL={publishingStore.uploadURL} />
    );
});

export default PublishReadyInfo;
