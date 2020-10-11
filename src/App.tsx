import React, { ReactElement, useEffect, useState } from "react";
import { observer } from "mobx-react";

import FullScreenLoader from "components/loader/FullScreenLoader";
import IDE from "components/layout/IDE";
import ModalManager from "components/layout/modals/ModalManager";
import NewProject from "components/projectManager/ProjectManager";
import ProjectLoadingError from "components/projectManager/ProjectLoadingError";
import LoggingNotification from "components/logging/LoggingNotification";

import { isSnippetsVariant } from "services/app/env";
import { pageView } from "services/app/loggers";
import projectServiceList from "services/projects/projectServiceList";
import { getSnippet, parseUrlForSnippetId, prepareSnippetProject as initSnippetProject } from "services/snippets/import";

import materialsStore from "stores/materialsStore";
import projectStore, { ProjectStoreState } from "stores/projectStore";
import settingsStore from "stores/settingsStore";


/**
 * This is the main component that does top-level routing between the few different
 * page types that we have: New project page, loading page, and the main IDE.
 */
const App: React.FC = observer( () => {
    const [ isLoadingSnippet, setIsLoadingSnippet ] = useState( isSnippetsVariant );

    if( isSnippetsVariant ) {
        useEffect( () => {
            const snippetId = parseUrlForSnippetId();

            if( snippetId ) {
                getSnippet( snippetId ).then( snippetData => {
                    if( snippetData ) {
                        initSnippetProject( snippetId, snippetData ).then( () => {
                            setIsLoadingSnippet( false );
                        });
                    }
                    else {
                        // TODO: error handling
                        setIsLoadingSnippet( false );
                    }
                });
            }
            else {
                setIsLoadingSnippet( false );
            }
        }, [] );
    }

    // wait for the possible snippet to load
    if( isLoadingSnippet ) {
        return <FullScreenLoader />;
    }

    // don't start before the filesystem is ready
    if( !materialsStore.fsReady ) {
        return null;
    }

    const main = ( (): ReactElement | null => {
        switch( projectStore.loadState  ) {
            case ProjectStoreState.waiting:
                // If there's only one project type which has only one template option,
                // start that automatically
                if( projectServiceList.length === 1 && projectServiceList[ 0 ].templates.length === 1 ) {
                    projectServiceList[ 0 ].initProject( projectServiceList[ 0 ].templates[ 0 ] );
                    return null;
                }

                // Mark this as a root page view in Analytics
                pageView( "/" );

                return <NewProject />;

            case ProjectStoreState.loading:
                return <FullScreenLoader title="Preparing project..." />;

            case ProjectStoreState.error:
                return <ProjectLoadingError />;

            case ProjectStoreState.ready:
                return <IDE />;
        }
    });

    const showLoggingNotification = settingsStore.getSetting( "transient", "showLoggingNotification" );

    return <>
        {main()}
        <ModalManager />
        {showLoggingNotification && <LoggingNotification />}
    </>;
});

export default App;
