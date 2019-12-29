import React from "react";
import { Tabs, TabList, TabLink, Tab } from "bloomer";


export const ProjectIndexTabsElement: React.FC<ProjectIndexTabsElement> = ({ activeTab, onClickTab }) => {
    const tabs = [ "Welcome", "Contents", "Actions", "Kinds", "Phrasebook", "Rules", "Scenes", "World" ];

    return <Tabs isSize="small">
        <TabList>
            {tabs.map( ( tab: string ) => <Tab key={tab} isActive={activeTab === tab}>
                <TabLink onClick={(): void => onClickTab( tab )}>
                    {tab}
                </TabLink>
            </Tab>
            )}
        </TabList>
    </Tabs>;
};

interface ProjectIndexTabsElement {
    activeTab: string;
    onClickTab: ( name: string ) => void;
}

/**
 * Tabs for navigating the index
 */
const ProjectIndexTabs: React.FC<ProjectIndexTabsElement> = ( props ) => {
    return <ProjectIndexTabsElement {...props} />;
};

export default ProjectIndexTabs;