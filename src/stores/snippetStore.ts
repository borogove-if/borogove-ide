import { action, makeObservable, observable } from "mobx";

export enum SnippetLoadState {
    idle,
    saving,
    saved,
    error
}

class SnippetStore {
    // The id of the current snippet
    id: string | null = null;

    // "Dirty" means the code has been edited after publishing
    isDirty = true;

    // Error message from the API
    saveError: string | null = null;

    // Current state of saving the snippet
    state = SnippetLoadState.idle;

    setDirty = ( state: boolean ): void => {
        this.isDirty = state;
    };

    setId = ( id: string | null ): void => {
        this.id = id;
    };

    setState = ( state: SnippetLoadState, errorMessage: string | null = null ): void => {
        this.state = state;
        this.saveError = errorMessage;
    };

    constructor() {
        makeObservable( this, {
            id: observable,
            isDirty: observable,
            saveError: observable,
            state: observable,
            setDirty: action,
            setId: action,
            setState: action
        });
    }
}

export default new SnippetStore();