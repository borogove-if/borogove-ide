import Axios from "axios";

import materialsStore from "stores/materialsStore";
import projectStore from "stores/projectStore";
import snippetStore, { SnippetLoadState } from "stores/snippetStore";


/**
 * Publish a snippet
 */
export const publishSnippet = async(): Promise<void> => {
    if( !projectStore.entryFile ) {
        return;
    }

    snippetStore.setState( SnippetLoadState.saving );

    const code = materialsStore.getContents( projectStore.entryFile );
    let request;

    snippetStore.setDirty( false );

    try {
        request = await Axios({
            url: process.env.REACT_APP_SNIPPETS_POST_API_URL + "/snippet",
            method: "POST",
            data: {
                code,
                revision: 1,
                template: projectStore.manager.template
            }
        });
    }
    catch( e ) {
        snippetStore.setState( SnippetLoadState.error, e.request?.data?.error );
        return;
    }

    if( !request?.data?.success ) {
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
