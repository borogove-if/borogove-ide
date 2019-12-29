import React from "react";
import { observer } from "mobx-react";
import { Container, Title, Columns, Column } from "bloomer";

import ReleaseCard from "./ReleaseCard";

import "./ReleasePane.scss";
import projectStore from "stores/projectStore";

interface ReleasePaneElementProps {
    cards: {
        id: string;
        description: string;
        onBuild: () => void;
        title: string;
    }[];
}

export const ReleasePaneElement: React.FC<ReleasePaneElementProps> = ({ cards }) => <Container>
    <Title>
        Release project
    </Title>

    <Columns id="release-options-list">
        {cards.map( card => <Column key={card.id}>
            <ReleaseCard onBuild={card.onBuild} title={card.title}>
                {card.description}
            </ReleaseCard>
        </Column> )}
    </Columns>
</Container>;


/**
 * Options for releasing a project
 */
const ReleasePane: React.FC = observer( () => {
    const cards = [
        {
            id: "gamefile",
            description: "Compile and download a game file. The players need a separate interpreter to play.",
            onBuild: (): void => { projectStore.release( "gamefile" ); },
            title: "Create a game file"
        },
        {
            id: "website",
            description: "Compile and download a playable online version of the game. You'll need to upload it online to a personal web site or a service like Itch.io.",
            onBuild: (): void => { projectStore.release( "website" ); },
            title: "Create a web site"
        }
    ];
    return <ReleasePaneElement cards={cards} />;
});

export default ReleasePane;