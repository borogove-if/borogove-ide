import React from "react";
import { observer } from "mobx-react";
import { TabList, Tabs } from "bloomer";
import PaneTab from "./PaneTab";
import FileManagerToggleButton from "components/fileManager/FileManagerToggleButton";
import ideStateStore from "stores/ideStateStore";

interface PaneTabNavElementProps {
    activeTabId: string | null;
    fileManagerToggle?: boolean;    // does this navigation have the file manager toggle button? Not a very clean solution, but should do for now
    hiddenInMobile?: boolean;        // hide this element in mobile view?
    onClick: ( id: string ) => void;
    onClose: ( id: string ) => void;
    tabs: Tab[];
}

export const PaneTabNavElement: React.FC<PaneTabNavElementProps> = observer( ({ activeTabId, fileManagerToggle = false, hiddenInMobile, onClick, onClose, tabs  }) => <div className={hiddenInMobile ? "is-hidden-mobile" : ""}>
    <Tabs>
        <TabList>
            {fileManagerToggle && <FileManagerToggleButton />}
            {tabs.map( tab => <PaneTab key={tab.id}
                                       label={tab.label}
                                       isActive={activeTabId === tab.id}
                                       isClosable={tab.closable}
                                       onClick={(): void => onClick( tab.id )}
                                       onClose={(): void => onClose( tab.id )} /> )}
        </TabList>
    </Tabs>
</div> );

/**
 * The tab navigation inside a pane.
 */
const PaneTabNav: React.FC<PaneTabNavElementProps> = observer( ( props ) => {
    return <PaneTabNavElement {...props} hiddenInMobile={!ideStateStore.wideScreenExists} />;
});

export default PaneTabNav;
