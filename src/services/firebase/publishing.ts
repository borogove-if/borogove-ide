import {
    getStorage,
    ref,
    StorageError,
    uploadBytesResumable,
    UploadTaskSnapshot
} from "firebase/storage";
import { getPublishingFirebaseApp } from "./setup";
import { v4 as uuid } from "uuid";

const PUBLISHING_UPLOAD_DIRECTORY = "pending";


/**
 * Uploads a file to Firebase into the temporary directory, for Borogove.io
 * to find when publishing. Returns the name of the file.
 */
export const uploadFile = (
    file: Blob,
    progressCallback: ( snapshot: UploadTaskSnapshot ) => void,
    errorCallback: ( a: StorageError ) => void,
    successCallback: () => void
): string => {
    const id = uuid();
    const firebaseApp = getPublishingFirebaseApp();
    const storage = getStorage( firebaseApp );
    const storageRef = ref( storage, `${PUBLISHING_UPLOAD_DIRECTORY}/${id}` );
    const uploadTask = uploadBytesResumable( storageRef, file );

    uploadTask.on( "state_changed", progressCallback, errorCallback, successCallback );

    return id;
};
