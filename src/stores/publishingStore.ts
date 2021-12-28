import { observable, action, makeObservable } from "mobx";
import { UploadTaskSnapshot } from "@firebase/storage";

import { uploadFile } from "services/firebase/publishing";
import { openTab } from "services/ide/tabService";

import { TabContentType } from "./tabStore";
import projectStore from "./projectStore";


export enum PublishingStage {
    idle,
    uploading,
    finished,
    error
}

/**
 * State of the publishing process when uploading to Borogove.io
 */
class PublishingStore {
    stage = PublishingStage.idle;

    // How far along the upload is, from 0 to 1
    uploadProgress: number;

    uploadedFileId: string;

    get uploadURL(): string {
        const format = projectStore.manager.storyFileFormat;
        const system = projectStore.manager.name;

        return `${process.env.REACT_APP_PUBLISHING_BASE_URL}/ide-upload/${this.uploadedFileId}/${format}/${system}`;
    }

    onUploadProgress = ( snapshot: UploadTaskSnapshot ): void => {
        this.uploadProgress = ( snapshot.bytesTransferred / snapshot.totalBytes );
    };

    onUploadError = (): void => {
        this.stage = PublishingStage.error;
    };

    onUploadSuccess = (): void => {
        this.uploadProgress = 1;
        this.stage = PublishingStage.finished;
    };

    public startFileUpload = ( content: Blob ): void => {
        this.stage = PublishingStage.uploading;

        openTab( TabContentType.publish, { closable: true });

        this.uploadedFileId = uploadFile(
            content,
            this.onUploadProgress,
            this.onUploadError,
            this.onUploadSuccess
        );
    };

    constructor() {
        makeObservable( this, {
            stage: observable,
            uploadProgress: observable,
            startFileUpload: action,
            onUploadProgress: action,
            onUploadError: action,
            onUploadSuccess: action
        });
    }
}

export default new PublishingStore();
