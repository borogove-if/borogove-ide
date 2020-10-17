import React from "react";
import { observer } from "mobx-react";
import { Button, Column, Columns, Title } from "bloomer";

import FullScreenLoader from "components/loader/FullScreenLoader";

import snippetStore, { SnippetLoadState } from "stores/snippetStore";

import { publishSnippet } from "services/snippets/publish";
import ShareLink from "./ShareLink";

interface SnippetReleaseInfoElementProps {
    errorMessage?: string | false | null;
    isDirty?: boolean;
    isLoading?: boolean;
    onPublish: () => void;
}

export const SnippetReleaseInfoElement: React.FC<SnippetReleaseInfoElementProps> = ({ errorMessage, isDirty = false, isLoading = false, onPublish }) => {
    const downloadOptions = ( noLimit = false ): JSX.Element => <>
        <hr />

        <Title size={4}>
            Download
        </Title>

        <p>
            Download the snippet instead with these options{noLimit && " (no character limit)"}:
        </p>
    </>;

    if( isLoading ) {
        return <div className="my-6">
            <FullScreenLoader />
        </div>;
    }

    if( errorMessage ) {
        return <div>
            <Columns>
                <Column>
                    <p>
                        Error saving snippet: <strong>{errorMessage}</strong>
                    </p>
                </Column>
                <Column isSize="narrow">
                    <Button isColor="info" onClick={onPublish}>
                        Try again
                    </Button>
                </Column>
            </Columns>
            {downloadOptions( true )}
        </div>;
    }

    return <section>
        <Title>
            Share a snippet
        </Title>

        <ShareLink />

        {isDirty && <Columns>
            <Column>
                Source code has changed. You can get a link to the new code
                by publishing the snippet again.
            </Column>
            <Column isSize="narrow">
                <Button isColor="info" onClick={onPublish}>
                    Re-publish
                </Button>
            </Column>
        </Columns>}

        {downloadOptions()}
    </section>;
};
// --> "normal" release options come right after this


/**
 * Publishing snippets
 */
const SnippetReleaseInfo: React.FC = observer( () => {
    return <SnippetReleaseInfoElement isDirty={snippetStore.isDirty}
                                      isLoading={snippetStore.state === SnippetLoadState.saving}
                                      errorMessage={snippetStore.state === SnippetLoadState.error && snippetStore.saveError}
                                      onPublish={publishSnippet} />;
});

export default SnippetReleaseInfo;