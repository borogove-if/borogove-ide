import React from "react";
import { observer } from "mobx-react";

import ideStateStore from "stores/ideStateStore";

import AddFileModal from "components/fileManager/actions/AddFileModal";
import DeleteFileModal from "components/fileManager/actions/DeleteFileModal";
import MoveFileModal from "components/fileManager/actions/MoveFileModal";
import OverwriteFileModal from "components/fileManager/actions/OverwriteFileModal";
import PrivacyPolicy from "components/logging/PrivacyPolicy";
import RenameFileModal from "components/fileManager/actions/RenameFileModal";
import SnippetsTOS from "components/snippets/SnippetsTOS";

/**
 * Handles opening modals
 */
const ModalManager: React.FC = observer( () => {
    const { currentlyOpenModal, modalProps } = ideStateStore;

    switch( currentlyOpenModal ) {
        /**
         * Filesystem
         */
        case "addFile":
            return <AddFileModal {...modalProps} />;

        case "deleteFile":
            return <DeleteFileModal {...modalProps} />;

        case "moveFile":
            return <MoveFileModal {...modalProps} />;

        case "overwriteFile":
            return <OverwriteFileModal {...modalProps} />;

        case "renameFile":
            return <RenameFileModal {...modalProps} />;

        /**
         * Documentation
         */
        case "privacyPolicy":
            return <PrivacyPolicy {...modalProps} />;

        case "snippetsTOS":
            return <SnippetsTOS {...modalProps} />;

        default:
            return null;
    }
});

export default ModalManager;