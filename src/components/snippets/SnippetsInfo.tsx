import React from "react";
import { Button, Column, Columns, Container, Title } from "bloomer";
import { TiFlag } from "react-icons/ti";

import { SNIPPET_MAX_CHARACTERS } from "services/snippets/constants";
import { isSnippetsVariant } from "services/app/env";

import projectStore from "stores/projectStore";
import ideStateStore from "stores/ideStateStore";
import snippetStore from "stores/snippetStore";

interface SnippetsInfoElementProps {
    flaggingUrl?: string | null;
    language?: string;
    onOpenPrivacyPolicy: () => void;
    onOpenTOS: () => void;
}

export const SnippetsInfoElement: React.FC<SnippetsInfoElementProps> = ({ flaggingUrl, language, onOpenPrivacyPolicy, onOpenTOS }) => <Container>
    <Title isSize={2}>
        Creating snippets
    </Title>

    <p>
        Write your code with the editor and test it by pressing the "Go" button.
        When you're ready, press the "Share" button in the main menu to publish the snippet and get a shareable link.
    </p>
    {language !== "ink" && <p>
        The standard library is included automatically
        {language === "inform7"
            ? " and all the extensions in the Public Library are available"
            : " (unless you chose a \"no library\" template)"}.
    </p>}
    <p>
        The code for one snippet can contain at most {new Intl.NumberFormat( "en" ).format( SNIPPET_MAX_CHARACTERS )} characters.
        {language !== "ink" && " Standard libraries and extensions are not counted in the limit."}
    </p>
    <p>
        You can't edit or remove a snippet after publishing it, but you can always create a new snippet based on the previous one.
    </p>
    <p>
        Tip: you can also share code that doesn't compile if you want to provide an example when asking for help online.
    </p>

    <hr />

    <Columns>
        <Column>
            <Button isColor="text" onClick={onOpenTOS}>
                Terms of Service
            </Button>
        </Column>
        <Column>
            <Button isColor="text" onClick={onOpenPrivacyPolicy}>
                Privacy policy
            </Button>
        </Column>
        {flaggingUrl && <Column>
            <Button href={flaggingUrl}
                    isColor="text"
                    target="_blank" rel="noreferrer"
                    className="is-light has-background-white has-text-grey-dark"
                    isLink>
                <TiFlag />
                Report snippet
            </Button>
        </Column>}
    </Columns>
</Container>;


/**
 * Info page tab for snippets
 */
const SnippetsInfo: React.FC = () => {
    const openPrivacyPolicy = (): void => {
        ideStateStore.openModal( "privacyPolicy" );
    };

    const openTOS = (): void => {
        ideStateStore.openModal( "snippetsTOS" );
    };

    const flaggingUrl = isSnippetsVariant && process.env.REACT_APP_FLAGGING_FORM_URL && snippetStore.id
        ? process.env.REACT_APP_FLAGGING_FORM_URL.split( "{id}" ).join( snippetStore.id ) : null;

    return <SnippetsInfoElement flaggingUrl={flaggingUrl}
                                language={projectStore.manager.language}
                                onOpenPrivacyPolicy={openPrivacyPolicy}
                                onOpenTOS={openTOS} />;
};

export default SnippetsInfo;
