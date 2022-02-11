import { observable, action, makeObservable } from "mobx";
import { v4 as uuid } from "uuid";

import { TabStore } from "./tabStore";


/**
 * This store contains the UI state of the IDE.
 */
class IDEStateStore {
    // Currently active pane (left or right), used for determining which pane
    // is shown in the mobile view
    activePane: TabStore;

    // Is the file manager visible?
    fileManagerOpen = true;

    // The id for the current session, which is used to optimize space
    // on the server (previous compilations can be removed faster if we know
    // that they were made with the same IDE instance.)
    // The id is regenerated every time the page reloads.
    readonly sessionId = uuid().split( "-" ).join( "" );

    currentlyOpenModal: string | null = null;
    modalProps: any;  // eslint-disable-line

    public closeModal = (): void => {
        this.currentlyOpenModal = null;
        this.modalProps = {};
    };

    public openModal = ( name: string, props?: any ): void => {  // eslint-disable-line
        this.modalProps = props;
        this.currentlyOpenModal = name;
    };

    public getActivePane = (): Tab | null => {
        return this.activePane.activeTab;
    };

    public setActivePane = ( pane: TabStore ): void => {
        this.activePane = pane;
    };

    public toggleFileManager = ( isOpen?: boolean ): void => {
        if( typeof isOpen === "boolean" ) {
            this.fileManagerOpen = isOpen;
        }
        else {
            this.fileManagerOpen = !this.fileManagerOpen;
        }
    };

    constructor() {
        makeObservable( this, {
            activePane: observable,
            fileManagerOpen: observable,
            currentlyOpenModal: observable,
            modalProps: observable,
            closeModal: action,
            openModal: action,
            setActivePane: action,
            toggleFileManager: action
        });
    }
}

export default new IDEStateStore();
