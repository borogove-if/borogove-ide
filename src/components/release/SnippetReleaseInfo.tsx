import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Button, Column, Columns, Input, Title } from "bloomer";
import { TiClipboard, TiTick } from "react-icons/ti";
import copy from "copy-to-clipboard";

import FullScreenLoader from "components/loader/FullScreenLoader";

import snippetStore, { SnippetLoadState } from "stores/snippetStore";
import projectStore from "stores/projectStore";

import { publishSnippet } from "services/snippets/publish";

interface SnippetReleaseInfoElementProps {
    errorMessage?: string | false | null;
    isDirty?: boolean;
    isLoading?: boolean;
    onPublish: () => void;
    url: string;
}

export const SnippetReleaseInfoElement: React.FC<SnippetReleaseInfoElementProps> = ({ errorMessage, isDirty = false, isLoading = false, onPublish, url }) => {
    const [ copied, setCopied ] = useState( false );

    useEffect( () => {
        // reset the copied check mark if the snippet URL changes
        setCopied( false );
    }, [ url ] );

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

    const copyToClipboard = (): void => {
        copy( url, { debug: true });
        setCopied( true );
    };

    return <section>
        <Title>
            Share a snippet
        </Title>

        <p>
            The link to this snippet is:
        </p>

        <Input value={url}
               isSize="large"
               className="mb-2"
               readOnly />
        <Columns>
            <Column>
                <Button onClick={copyToClipboard}>
                    <TiClipboard />{" "}Copy to clipboard
                    {copied && <TiTick color="green" title="Copied!" />}
                </Button>
            </Column>
        </Columns>

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
    const url = `${process.env.REACT_APP_SNIPPETS_PLAY_URL}/${projectStore.manager.language}/${snippetStore.id}`;

    return <SnippetReleaseInfoElement isDirty={snippetStore.isDirty}
                                      isLoading={snippetStore.state === SnippetLoadState.saving}
                                      errorMessage={snippetStore.state === SnippetLoadState.error && snippetStore.saveError}
                                      onPublish={publishSnippet}
                                      url={url} />;
});

export default SnippetReleaseInfo;