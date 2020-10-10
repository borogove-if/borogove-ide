import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Button, Column, Columns, Input, Title } from "bloomer";
import { TiClipboard, TiTick } from "react-icons/ti";
import copy from "copy-to-clipboard";

import FullScreenLoader from "components/loader/FullScreenLoader";

import snippetStore, { SnippetLoadState } from "stores/snippetStore";
import { publishSnippet } from "services/snippets/publish";

interface SnippetReleaseInfoElementProps {
    isDirty?: boolean;
    isLoading?: boolean;
    onPublish: () => void;
    snippetId: string | null;
}

export const SnippetReleaseInfoElement: React.FC<SnippetReleaseInfoElementProps> = ({ isDirty = false, isLoading = false, onPublish, snippetId }) => {
    const [ copied, setCopied ] = useState( false );

    useEffect( () => {
        // reset the copied check mark if the snippet URL changes
        setCopied( false );
    }, [ snippetId ] );

    if( isLoading ) {
        return <div className="my-6">
            <FullScreenLoader />
        </div>;
    }

    const url = `${process.env.REACT_APP_SNIPPETS_PLAY_URL}/${snippetId}`;

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
                Source code has changed. You can get a new link by publishing the snippet again.
            </Column>
            <Column>
                <Button isColor="info" onClick={onPublish}>
                    Re-publish
                </Button>
            </Column>
        </Columns>}

        <hr />

        <Title size={4}>
            Download
        </Title>

        <p>
            Download the snippet instead with these options:
        </p>
    </section>;
};
// --> "normal" release options come right after this


/**
 * Publishing snippets
 */
const SnippetReleaseInfo: React.FC = observer( () => {
    return <SnippetReleaseInfoElement isDirty={snippetStore.isDirty}
                                      isLoading={snippetStore.state === SnippetLoadState.saving}
                                      snippetId={snippetStore.id}
                                      onPublish={publishSnippet} />;
});

export default SnippetReleaseInfo;