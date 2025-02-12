import { FirebaseApp, getApp, initializeApp } from "firebase/app";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

import { snippetsConfig, publishingConfig } from "./firebase.config";
import { isSnippetsVariant } from "services/app/env";

const PUBLISHING_FIREBASE_APP_ID = "publishing";
const SNIPPETS_FIREBASE_APP_ID = "snippets";

export const getPublishingFirebaseApp = (): FirebaseApp =>
    getApp(PUBLISHING_FIREBASE_APP_ID);
export const getSnippetsFirebaseApp = (): FirebaseApp =>
    getApp(SNIPPETS_FIREBASE_APP_ID);

/**
 * Firebase initialization
 */
export const initFirebase = (): void => {
    if ("apiKey" in publishingConfig) {
        const publishingApp = initializeApp(
            publishingConfig,
            PUBLISHING_FIREBASE_APP_ID
        );

        if (location.hostname === "localhost") {
            const storage = getStorage(publishingApp);
            connectStorageEmulator(storage, "localhost", 9199);
        }
    }

    if (isSnippetsVariant && "apiKey" in snippetsConfig) {
        const snippetsApp = initializeApp(
            snippetsConfig,
            SNIPPETS_FIREBASE_APP_ID
        );

        if (location.hostname === "localhost") {
            const db = getDatabase(snippetsApp);
            connectDatabaseEmulator(db, "localhost", 9000);
        }
    }
};
