import React from "react";
import { Tabs, TabList, TabLink, Tab } from "bloomer";

import { I7CompilerVersion } from "services/projects/inform7/inform7ProjectService";
import projectStore from "stores/projectStore";

interface ProjectIndexTabsElementProps extends ProjectIndexTabsProps {
    compilerVersion: I7CompilerVersion;
}

export const ProjectIndexTabsElement: React.FC<
    ProjectIndexTabsElementProps
> = ({ activeTab, compilerVersion, onClickTab }) => {
    const tabs = [
        "Welcome",
        "Contents",
        "Actions",
        "Kinds",
        "Phrasebook",
        "Rules",
        "Scenes",
        "World"
    ];

    if (compilerVersion === "6G60") {
        // 6G60 doesn't have the Welcome tab
        tabs.shift();
    }

    return (
        <Tabs isSize="small">
            <TabList>
                {tabs.map((tab: string) => (
                    <Tab key={tab} isActive={activeTab === tab}>
                        <TabLink onClick={(): void => onClickTab(tab)}>
                            {tab}
                        </TabLink>
                    </Tab>
                ))}
            </TabList>
        </Tabs>
    );
};

interface ProjectIndexTabsProps {
    activeTab: string;
    onClickTab: (name: string) => void;
}

/**
 * Tabs for navigating the index
 */
const ProjectIndexTabs: React.FC<ProjectIndexTabsProps> = props => {
    const compilerVersion = projectStore.compilerVersion as I7CompilerVersion;

    return (
        <ProjectIndexTabsElement {...props} compilerVersion={compilerVersion} />
    );
};

export default ProjectIndexTabs;
