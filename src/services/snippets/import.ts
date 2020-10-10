import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";

import projectServiceList from "services/projects/projectServiceList";

import snippetStore from "stores/snippetStore";
import editorStateStore from "stores/editorStateStore";
import projectStore from "stores/projectStore";

const SNIPPET_ID_MIN_LENGTH = 5;


/**
 * Firebase initialization
 */
export const initFirebase = (): void => {
    const firebaseConfig = {
        apiKey: "AIzaSyCNaPF0uWxzrw68MEeIwdjVzRxiIeF_Ewg",
        authDomain: "borogove-ide.firebaseapp.com",
        databaseURL: "https://borogove-ide.firebaseio.com",
        projectId: "borogove-ide",
        storageBucket: "borogove-ide.appspot.com",
        messagingSenderId: "571355987682",
        appId: "1:571355987682:web:7d949700c4b7cabf5628bb",
        measurementId: "G-Y3RG7241MC"
    };

    firebase.initializeApp( firebaseConfig );
    firebase.analytics();
};


/**
 * Retrieves snippet data from Firebase by the snippet id
 */
export const getSnippet = async( snippetId: string ): Promise<any | null> => {
    try {
        const db = firebase.database();
        const snapshot = await db.ref( "/snippets/" + snippetId ).once( "value" );

        return snapshot.val();
    }
    catch( e ) {
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
export const prepareSnippetProject = async( id: string, snippetData: any ): Promise<void> => {
    const { code } = snippetData;

    // Store the data in the snippet store
    snippetStore.setId( id );
    snippetStore.setDirty( false );

    // TODO: should be based on the snippet data!
    await projectServiceList[ 0 ].initProject( projectServiceList[ 0 ].templates[ 0 ] );

    editorStateStore.setContents( code, true );
    projectStore.compile( "debug" );
};