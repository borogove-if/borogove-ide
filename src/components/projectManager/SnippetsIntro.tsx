import React from "react";
import { Box } from "bloomer";

export const SnippetsIntroElement: React.FC = () => <Box>
    <p>
        Snippets are short projects that you can share with others. Anyone who
        has a link to a published snippet can see the code, run the project and
        use it as a template to create their own snippet.
    </p>
    <p>
        Start by choosing a language and a template below.
    </p>
</Box>;

/**
 * Shows the initial info text in the project manager about what snippets are
 */
const SnippetsIntro: React.FC = () => {
    return <SnippetsIntroElement />;
};

export default SnippetsIntro;
