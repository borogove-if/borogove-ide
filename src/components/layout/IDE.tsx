import React from "react";

import { observer } from "mobx-react";
import Split from "services/ide/splitGridService";

import MainNavigation from "./topNavbar/MainNavigation";
import Pane from "./panes/Pane";

import ideStateStore from "stores/ideStateStore";
import { isSnippetsVariant } from "services/app/env";

import "./IDE.scss";

const FileManager = isSnippetsVariant
    ? require("components/fileManager/ReadOnlyFileManager").default
    : require("components/fileManager/FileManager").default;

/**
 * This is the main component for the entire IDE view.
 */
const IDE: React.FC = observer(() => {
    return (
        <div id="ide">
            <MainNavigation />
            <div
                id="workspace"
                className={
                    ideStateStore.fileManagerOpen
                        ? "is-file-manager-open"
                        : undefined
                }>
                {ideStateStore.fileManagerOpen && <FileManager />}
                <Split minSize={300} cursor="col-resize">
                    {({ getGridProps, getGutterProps }: any): JSX.Element => (
                        <div className="grid" {...getGridProps()}>
                            <Pane key="left" side="left" />
                            <div
                                className="gutter-col is-hidden-mobile"
                                {...getGutterProps("column", 1)}
                            />
                            <Pane key="right" side="right" />
                        </div>
                    )}
                </Split>
            </div>
        </div>
    );
});

export default IDE;
