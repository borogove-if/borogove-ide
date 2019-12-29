import React from "react";
import { observer } from "mobx-react";
import { Tabs, TabList, Tab, TabLink } from "bloomer";

import "./FileManagerNav.scss";

// interface FileManagerNavElementProps {
// }

export const FileManagerNavElement: React.FC = observer( () => <Tabs id="file-manager-nav" isAlign="centered" isSize="small">
    <TabList>
        <Tab isActive>
            <TabLink>
                <span>Materials</span>
            </TabLink>
        </Tab>
        <Tab>
            <TabLink>
                <span>Extensions</span>
            </TabLink>
        </Tab>
    </TabList>
</Tabs> );

// interface FileManagerNavProps {
// }

/**
 * Tabs to switch between project and library files
 */
const FileManagerNav: React.FC = observer( () => {
    return <FileManagerNavElement />;
});

export default FileManagerNav;