import React from "react";
import { observer } from "mobx-react";
import { Tab, TabLink, TabList, Tabs } from "bloomer";
import { TiInfoLarge } from "react-icons/ti";
import ideStateStore from "stores/ideStateStore";


interface BrandNavElementProps {
    activeSite: string;
    ideURL?: string;
    openInfoPage: () => void;
    publishingURL?: string;
    snippetsURL?: string;
}

export const BrandNavElement: React.FC<BrandNavElementProps> = ({ activeSite, ideURL, openInfoPage, publishingURL, snippetsURL }) => {
    // count how many URLs were given and only show the links if there are at least 2 URLs
    const urlCount = [ ideURL, snippetsURL, publishingURL ].reduce( ( count, url ) => count + ( url ? 1 : 0 ), 0 );

    if( urlCount <= 1 ) {
        return null;
    }

    return <Tabs id="brandNav">
        <TabList>
            {ideURL && <Tab isActive={activeSite === "ide"}>
                <TabLink href={ideURL}>
                    IDE
                </TabLink>
            </Tab>}
            {snippetsURL && <Tab isActive={activeSite === "snippets"}>
                <TabLink href={snippetsURL}>
                    Snippets
                </TabLink>
            </Tab>}
            {publishingURL && <Tab>
                <TabLink href={publishingURL}>
                    Publishing
                </TabLink>
            </Tab>}
            <Tab>
                <TabLink onClick={openInfoPage}>
                    <span>
                        <TiInfoLarge />
                    </span>
                </TabLink>
            </Tab>
        </TabList>
    </Tabs>;
};


/**
 * Navigation links between IDE, Snippets and Publishing
 */
const BrandNav: React.FC = observer( () => {
    const openInfoPage = (): void => ideStateStore.openModal( "overview" );

    return <BrandNavElement activeSite={process.env.REACT_APP_VARIANT || ""}
                            ideURL={process.env.REACT_APP_IDE_BASE_URL}
                            publishingURL={process.env.REACT_APP_PUBLISHING_BASE_URL}
                            snippetsURL={process.env.REACT_APP_SNIPPETS_BASE_URL}
                            openInfoPage={openInfoPage} />;
});

export default BrandNav;
