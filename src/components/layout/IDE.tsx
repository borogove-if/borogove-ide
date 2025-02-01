import React, { useEffect } from "react";

import { observer } from "mobx-react";
import Split from "services/ide/splitGridService";

import MainNavigation from "./topNavbar/MainNavigation";
import Pane from "./panes/Pane";

import ideStateStore from "stores/ideStateStore";
import { isSnippetsVariant } from "services/app/env";
import routeStore from "stores/routeStore";
import materialsStore, { MaterialsFileType } from "stores/materialsStore";
import { openTab } from "services/ide/tabService";
import { TabContentType } from "stores/tabStore";
import projectStore from "stores/projectStore";

import "./IDE.scss";

const FileManager = isSnippetsVariant
    ? require( "components/fileManager/ReadOnlyFileManager" ).default
    : require( "components/fileManager/FileManager" ).default;

/**
 * This is the main component for the entire IDE view.
 */
const IDE: React.FC = observer( () => {
    const { file, project } = routeStore;

    useEffect( () => {
        if( !file ) {
            if( project ) {
                const mainFile = materialsStore.getAllFiles().find( materialFile => materialFile.id === projectStore.entryFile?.id );

                if( mainFile ) {
                    materialsStore.openFile( mainFile );
                }
            }

            return;
        }

        const materialsFile = materialsStore.findByFullPath( file );

        switch( materialsFile?.type ) {
            case MaterialsFileType.code:
            case MaterialsFileType.text:
                materialsStore.openFile( materialsFile );
                break;

            case MaterialsFileType.audio:
            case MaterialsFileType.image:
                openTab( TabContentType.fileViewer, {
                    closable: true,
                    label: materialsFile.displayName || materialsFile.name,
                    props: { file }
                });
                break;

            default:
                // do nothing
        }
    }, [ file ] );

    return <div id="ide">
        <MainNavigation />
        <div id="workspace" className={ideStateStore.fileManagerOpen ? "is-file-manager-open" : undefined}>
            {ideStateStore.fileManagerOpen && <FileManager />}
            <Split minSize={300}
                   cursor="col-resize">
                {({
                    getGridProps,
                    getGutterProps
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }: any ): JSX.Element => (
                    <div className="grid" {...getGridProps()}>
                        <Pane key="left" side="left" />
                        <div className="gutter-col is-hidden-mobile" {...getGutterProps( "column", 1 )} />
                        <Pane key="right" side="right" />
                    </div>
                )}
            </Split>
        </div>
    </div>;
});

export default IDE;
