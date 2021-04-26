import React from "react";
import { observer } from "mobx-react";
import PaneTabNav from "./PaneTabNav";
import { leftTabStore, rightTabStore, TabStore } from "stores/tabStore";
import EmptyPane from "./EmptyPane";
import ideStateStore from "stores/ideStateStore";

interface PaneElementProps {
    activeTab: Tab | null;
    fileManagerToggle: boolean;
    hideInMobile: boolean;
    onClick: ( id: string ) => void;
    onClose: ( id: string ) => void;
    tabsList: Tab[];
}

export const PaneElement: React.FC<PaneElementProps> = ({ activeTab, fileManagerToggle, hideInMobile, onClick, onClose, tabsList }) => <div className={"pane" + ( hideInMobile ? " is-hidden-mobile" : "" )}>
    <PaneTabNav activeTabId={activeTab && activeTab.id}
                fileManagerToggle={fileManagerToggle}
                onClick={onClick}
                onClose={onClose}
                tabs={tabsList} />
    <div className="tab-content-container">
        {tabsList.length > 0
        ? tabsList.map( tab => <div key={tab.id} className={"tab-content " + ( ( activeTab && activeTab.id === tab.id ) ? "active" : "inactive" )}>
            {tab.component}
        </div> )
        : <EmptyPane />}
    </div>
</div>;

interface PaneProps {
    side: "left" | "right";
}

/**
 * IDE panes (the left and right main containers)
 */
const Pane: React.FC<PaneProps> = observer( ({ side }) => {
    let tabStore: TabStore;
    let fileManagerToggle = false;  // should the tabs contain the file manager toggle button?

    // Select the tab store based on which side tab we're displaying.
    // Tab stores contain the state of the tabs (which tabs are available,
    // which one is currently open)
    if( side === "left" ) {
        tabStore = leftTabStore;
        fileManagerToggle = true;
    }
    else {
        tabStore = rightTabStore;
    }

    // determine if we should hide the panel when the window size is mobile-sized
    const hideInMobile = !ideStateStore.wideScreenExists && tabStore !== ideStateStore.activePane;

    // the tab store will handle tab actions
    const onClickTab = ( id: string ): void => tabStore.setActiveTab( id );
    const onCloseTab = ( id: string ): void => { tabStore.removeTab( id ); };

    return <PaneElement activeTab={tabStore.activeTab}
                        fileManagerToggle={fileManagerToggle}
                        hideInMobile={hideInMobile}
                        onClick={onClickTab}
                        onClose={onCloseTab}
                        tabsList={tabStore.tabsList} />;
});

export default Pane;
