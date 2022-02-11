import { observable, action, computed, IObservableArray, makeObservable } from "mobx";
import { v4 as uuid } from "uuid";

import ideStateStore from "./ideStateStore";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export enum TabContentType {
    compiler,
    editor,
    fileViewer,
    interpreter,
    projectIndex,
    publish,
    release,
    settings,
    snippetsInfo,
    welcome
}


/**
 * Tabs that are shown on the left and right panes.
 */
export class TabStore {
    activeTabId: string | null = null;

    readonly tabsList: IObservableArray<Tab> = observable.array( [] );  // can't use @observable here because it doesn't apply the correct type for Typescript


    /**
     * Create a new tab. Pass in the tab's properties except for its id which is
     * generated automatically.
     *
     * Returns the created tab's id.
     */
    addTab = ( properties: Omit<Tab, "id"> & { id?: string }): string => {
        const tab = {
            id: uuid(),
            ...properties
        };

        // calculate where to insert the new tab in relation to other tabs...
        let insertionIndex = this.tabsList.length;

        // if there is no index specified, put it at the end (the default)
        if( tab.index ) {
            const { index } = tab;
            const nextTabIndex = this.tabsList.findIndex( t => !t.index || t.index > index );

            if( nextTabIndex > -1 ) {
                insertionIndex = nextTabIndex;
            }
        }

        // ...then insert it there
        this.tabsList.splice( insertionIndex, 0, tab );

        if( properties.isActive !== false ) {
            this.setActiveTab( tab.id );
        }

        return tab.id;
    };


    /**
     * Sets the currently open tab by the tab id.
     */
    setActiveTab = ( id: string ): void => {
        this.activeTabId = id;
        ideStateStore.setActivePane( this );
    };


    /**
     * Removes a tab completely.
     */
    removeTab = ( id: string ): boolean => {
        const tabToRemove = this.tabsList.find( tab => tab.id === id );

        if( tabToRemove ) {
            this.tabsList.remove( tabToRemove );
            return true;
        }

        return false;
    };


    /**
     * Removes a tab by type.
     */
    public removeTabType = ( type: TabContentType ): boolean => {
        const tab = this.findByType( type );

        if( !tab ) {
            return false;
        }

        return this.removeTab( tab.id );
    };


    /**
     * Returns the currently open tab.
     */
    public get activeTab(): Tab | null {
        return this.tabsList.find( tab => tab.id === this.activeTabId ) || null;
    }


    /**
     * Find an existing tab by id
     */
    public findById = ( id: string ): Tab | undefined => this.tabsList.find( tab => tab.id === id );


    /**
     * Given a tab type, finds and returns an existing tab of that type
     * or undefined if one doesn't exist.
     */
    public findByType = ( type: TabContentType ): Tab | undefined => this.tabsList.find( tab => tab.type === type );


    constructor() {
        makeObservable( this, {
            activeTabId: observable,
            addTab: action,
            setActiveTab: action,
            removeTab: action,
            activeTab: computed
        });
    }
}

// Export tab stores separately for the left and right panes
export const leftTabStore = new TabStore();
export const rightTabStore = new TabStore();
