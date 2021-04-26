import React, { useCallback, useEffect, useState } from "react";
import { Button, Column, Columns, Input, Tab, TabLink, TabList, Tabs, TextArea } from "bloomer";
import { TiClipboard, TiTick } from "react-icons/ti";
import copy from "copy-to-clipboard";
import { observer } from "mobx-react";
import projectStore from "stores/projectStore";
import snippetStore from "stores/snippetStore";

const IFRAME_DIMENSIONS = {
    height: 450,
    width: 680
} as const;

enum ShareLinkType {
    url,
    iframe
}

interface ShareLinkElementProps {
    snippetId: string;
    isDirty?: boolean;
    language: string;
}

export const ShareLinkElement: React.FC<ShareLinkElementProps> = ({ snippetId, isDirty = false, language }) => {
    const [ copied, setCopied ] = useState( false );
    const [ linkType, setLinkType ] = useState( ShareLinkType.iframe );

    const text = linkType === ShareLinkType.url ?
        `${process.env.REACT_APP_SNIPPETS_PLAY_URL}/${language}/${snippetId}` :
        `<iframe width="${IFRAME_DIMENSIONS.width}" height="${IFRAME_DIMENSIONS.height}" src="${process.env.REACT_APP_SNIPPETS_EMBED_URL}/?id=${snippetId}"></iframe>`;
    const instructions = linkType === ShareLinkType.url ?
        `The direct web address to ${isDirty ? "the original" : "this"} snippet is:` :
        `Copy-paste the below code to a forum post, your web site, or almost anywhere else HTML code can be used. It embeds ${isDirty ? "the original" : "this"} project into the web page as a runnable snippet.`;

    useEffect( () => {
        // reset the copied check mark if the snippet URL changes
        if( copied ) {
            setCopied( false );
        }
    }, [ text ] );

    const copyToClipboard = useCallback( (): void => {
        copy( text, { debug: true });
        setCopied( true );
    }, [ text ] );

    return <div>
        <Columns>
            <Column>
                {instructions}
            </Column>
            <Column isSize="narrow">
                <Tabs>
                    <TabList>
                        <Tab isActive={linkType === ShareLinkType.url}
                             onClick={(): void => setLinkType( ShareLinkType.url )}>
                            <TabLink>
                                Direct address
                            </TabLink>
                        </Tab>
                        <Tab isActive={linkType === ShareLinkType.iframe}
                             onClick={(): void => setLinkType( ShareLinkType.iframe )}>
                            <TabLink>
                                Forum code / embedded
                            </TabLink>
                        </Tab>
                    </TabList>
                </Tabs>
            </Column>
        </Columns>

        {linkType === ShareLinkType.url && <Input value={text}
                                                  isSize="large"
                                                  className="mb-2"
                                                  readOnly />}
        {linkType === ShareLinkType.iframe && <TextArea value={text}
                                                        isSize="large"
                                                        className="mb-2"
                                                        rows={2}
                                                        readOnly />}

        <Columns>
            <Column>
                <Button onClick={copyToClipboard}>
                    <TiClipboard />{" "}Copy to clipboard
                    {copied && <TiTick color="green" title="Copied!" />}
                </Button>
            </Column>
        </Columns>
    </div>;
};

/**
 * Show a link or embed code to the current snippet
 */
const ShareLink: React.FC = observer( () => {
    return <ShareLinkElement isDirty={snippetStore.isDirty} language={projectStore.manager.language}
                             snippetId={snippetStore.id || ""} />;
});

export default ShareLink;
