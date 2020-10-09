import React from "react";

import { observer } from "mobx-react";
import Split from "react-split";

import MainNavigation from "./topNavbar/MainNavigation";
import Pane from "./panes/Pane";

import ideStateStore from "stores/ideStateStore";
import { useWindowDimensions } from "services/ide/environmentService";
import { breakpoints } from "services/ide/environmentService";
import { isSnippetsVariant } from "services/app/env";

import "./IDE.scss";

const FileManager = isSnippetsVariant
    ? require( "components/fileManager/ReadOnlyFileManager" ).default
    : require( "components/fileManager/FileManager" ).default;

/**
 * This is the main component for the entire IDE view.
 */
const IDE: React.FC = observer( () => {
    const { width } = useWindowDimensions();

    const panes = [
        <Pane key="left" side="left" />,
        <Pane key="right" side="right" />
    ];

    let isMobile = width <= breakpoints.mobile;

    ideStateStore.setWideScreenExists( ideStateStore.wideScreenExists || !isMobile );

    if( ideStateStore.wideScreenExists ) {
        // if we've already seen a wide screen, pretend that mobile view doesn't exist to avoid re-renders
        isMobile = false;
    }

    const fileManagerOpen = !isMobile && ideStateStore.fileManagerOpen;

    return <div id="ide">
        <MainNavigation />
        <div id="workspace">
            {fileManagerOpen && <FileManager />}
            {isMobile
                ? panes
                : <Split id="split"
                         sizes={[ 50, 50 ]}
                         minSize={300}
                         expandToMin
                         gutterSize={10}
                         gutterAlign="center"
                         direction="horizontal"
                         cursor="col-resize">
                    {panes}
                </Split>}
        </div>
    </div>;
});

export default IDE;
