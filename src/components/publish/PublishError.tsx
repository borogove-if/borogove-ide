import React from "react";

export const PublishErrorElement: React.FC = () => <section>
    <p>
        Something went wrong when trying to upload the story file to a temporary location for publication.
        Please try again.
    </p>
</section>;


/**
 * Error message when uploading the story file for publishing is unsuccessful
 */
const PublishError: React.FC = () => {
    return <PublishErrorElement />;
};

export default PublishError;
