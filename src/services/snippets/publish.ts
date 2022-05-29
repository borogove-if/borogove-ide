import Axios, { AxiosError, AxiosResponse } from "axios";

import materialsStore from "stores/materialsStore";
import projectStore from "stores/projectStore";
import settingsStore from "stores/settingsStore";
import snippetStore, { SnippetLoadState } from "stores/snippetStore";

import type { VorpleLibraryVersion } from "services/projects/inform7/inform7VorpleProjectService";

const GENERIC_ERROR_MESSAGE = "Cannot connect to snippet service";

interface SnippetPublishingResponse {
    error?: string;
    id: string;
    success: boolean;
}


/**
 * Publish a snippet
 */
export const publishSnippet = async(): Promise<void> => {
    if( !projectStore.entryFile ) {
        return;
    }

    snippetStore.setState( SnippetLoadState.saving );

    const code = materialsStore.getContents( projectStore.entryFile );
    let request: AxiosResponse<SnippetPublishingResponse>;

    snippetStore.setDirty( false );

    // On Vorple projects send the version number
    const isVorple = projectStore.manager.interpreter === "vorple";
    const getVorpleVersion = (): VorpleLibraryVersion => settingsStore.getSetting( "language", "libraryVersion", process.env.REACT_APP_DEFAULT_VORPLE_VERSION );

    const partialData = {
        code,
        revision: 1,
        template: projectStore.manager.template
    };

    const data = isVorple ? {
        ...partialData,
        library: getVorpleVersion()
    } : {
        ...partialData,
        compiler: projectStore.compilerVersion
    };

    try {
        request = await Axios({
            url: process.env.REACT_APP_SNIPPETS_API_URL + "/snippet",
            method: "POST",
            data
        });
    }
    catch( e ) {
        try {
            snippetStore.setState( SnippetLoadState.error, JSON.parse( ( e as AxiosError ).request.response ).error || GENERIC_ERROR_MESSAGE );
        }
        catch( e ) {
            snippetStore.setState( SnippetLoadState.error, GENERIC_ERROR_MESSAGE );
        }
        return;
    }

    if( !request.data?.success ) {
        snippetStore.setState( SnippetLoadState.error, request.data?.error );
        return;
    }

    snippetStore.setId( request.data.id );
    snippetStore.setState( SnippetLoadState.saved );
};


/**
 * Publish a snippet, but only if we haven't published one yet
 */
export const firstSnippetPublish = (): void => {
    if( !snippetStore.id && [ SnippetLoadState.idle, SnippetLoadState.error ].includes( snippetStore.state ) ) {
        publishSnippet();
    }
};
