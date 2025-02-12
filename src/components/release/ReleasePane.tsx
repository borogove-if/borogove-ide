import React from "react";
import { observer } from "mobx-react";
import { Container, Title, Columns, Column } from "bloomer";

import ReleaseCard from "./ReleaseCard";
import SnippetReleaseInfo from "./SnippetReleaseInfo";

import projectStore, { ReleaseType } from "stores/projectStore";
import { isIdeVariant, isSnippetsVariant } from "services/app/env";

import "./ReleasePane.scss";

interface ReleasePaneElementProps {
    cards: {
        id: string;
        buttonText: string;
        description: string;
        onBuild: () => void;
        title: string;
        wide?: boolean;
    }[];
}

export const ReleasePaneElement: React.FC<ReleasePaneElementProps> = ({
    cards
}) => (
    <Container>
        {isIdeVariant && <Title>Release project</Title>}

        {isSnippetsVariant && <SnippetReleaseInfo />}

        <Columns id="release-options-list">
            {cards.map(card => (
                <Column key={card.id} isSize={card.wide ? "full" : undefined}>
                    <ReleaseCard
                        onBuild={card.onBuild}
                        title={card.title}
                        buttonText={card.buttonText}>
                        {card.description}
                    </ReleaseCard>
                </Column>
            ))}
        </Columns>
    </Container>
);

/**
 * Options for releasing a project
 */
const ReleasePane: React.FC = observer(() => {
    const cards = [
        {
            id: "publish",
            buttonText: "Publish",
            description:
                "Publish the game on Borogove.io. You'll get a link to play the game online. The game can optionally be published on the site's front page. You will be asked to log in with a Google account.",
            onBuild: (): void => {
                projectStore.release(ReleaseType.publish);
            },
            title: "Publish Online",
            wide: true
        },
        {
            id: "gamefile",
            buttonText: "Download File",
            description:
                "Compile and download a game file. The players need a separate interpreter to play.",
            onBuild: (): void => {
                projectStore.release(ReleaseType.gamefile);
            },
            title: "Download a Game File"
        },
        {
            id: "website",
            buttonText: "Download Web Site",
            description:
                "Compile and download a playable online version of the game. You'll need to upload it online to a personal web site or a service like Itch.io.",
            onBuild: (): void => {
                projectStore.release(ReleaseType.website);
            },
            title: "Download a Web Site"
        }
    ];
    return <ReleasePaneElement cards={cards} />;
});

export default ReleasePane;
