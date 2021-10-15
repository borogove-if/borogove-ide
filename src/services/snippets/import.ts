import { child, get, getDatabase, ref } from "firebase/database";

import { getSnippetsFirebaseApp } from "services/firebase/setup";
import projectServiceList from "services/projects/projectServiceList";

import snippetStore from "stores/snippetStore";
import editorStateStore from "stores/editorStateStore";
import projectStore from "stores/projectStore";

import { FirebaseSnippetData } from "types/snippets";

const SNIPPET_ID_MIN_LENGTH = 6;


/**
 * Retrieves snippet data from Firebase by the snippet id
 */
export const getSnippet = async( snippetId: string ): Promise<FirebaseSnippetData | null> => {
    console.log( "getSnippet " + snippetId );
    try {
        const firebaseApp = getSnippetsFirebaseApp();
        const db = getDatabase( firebaseApp );
        const dbRef = ref( db );
        const snapshot = await get( child( dbRef,  "/snippets/" + snippetId ) );

        return snapshot.val();
    }
    catch( e ) {
        console.log( e );
        return null;
    }
};


/**
 * Gets the snippet id from the URL
 */
export const parseUrlForSnippetId = (): string | null => {
    const { pathname } = window.location;

    const parts = pathname.split( "/" );

    if( parts.length < 3 || parts[ 2 ].length < SNIPPET_ID_MIN_LENGTH ) {
        // TODO: add better id validation (regex based on the id generation rules)
        return null;
    }

    return parts[ 2 ];
};


/**
 * Starts a project with the snippet data
 */
export const prepareSnippetProject = async( id: string, snippetData: FirebaseSnippetData ): Promise<void> => {
    const { code } = snippetData;

    // Store the data in the snippet store
    snippetStore.setId( id );
    snippetStore.setDirty( false );

    // Find which template this snippet uses
    let projectIndex: number | null = null;
    let templateIndex: number | null = null;

    projectServiceList.forEach( ( projectService, li ) => projectService.templates.forEach( ( template, ti ) => {
        if( template.id === snippetData.template ) {
            projectIndex = li;
            templateIndex = ti;
        }
    }) );

    if( projectIndex === null || templateIndex === null ) {
        // TODO error message
        console.error( "Unknown template " + snippetData.template );
        return;
    }

    await projectServiceList[ projectIndex ].initProject( projectServiceList[ projectIndex ].templates[ templateIndex ] );

    editorStateStore.setContents( code, true );
    projectStore.compile( "debug" );
};
