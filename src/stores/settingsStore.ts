import { observable, action, makeObservable } from "mobx";
import projectStore from "./projectStore";

const SETTINGS_KEY = "borogove.settings";

/**
 * User-defined settings
 */
class SettingsStore {
    compilerOptions: string[] = [];
    settings: AppSettings;

    constructor() {
        makeObservable( this, {
            compilerOptions: observable,
            settings: observable,
            saveSetting: action
        });

        let settings: any = {}; // eslint-disable-line

        try {
            const storageContents = localStorage?.getItem( SETTINGS_KEY );

            if( storageContents ) {
                settings = JSON.parse( storageContents ) || {};
            }

            if( typeof settings !== "object" ) {
                settings = {};
            }
        }
        catch( e ) {
            // do nothing
        }

        // the ...settings.<foo> overwrites defaults with saved preferences if they exist
        this.settings = {
            editor: {
                fontFamily: "monospace",
                fontSize: 14,
                lineNumbers: true,
                wordWrap: true,
                wrappingIndent: true,
                ...settings.editor
            },
            filesystem: {
                askBeforeOverwrite: true,
                ...settings.filesystem
            },
            logging: {
                analytics: !this.hasDoNotTrack(),
                errors: !this.hasDoNotTrack(),
                ...settings.logging
            },
            language: {     // language-specific settings
                ...settings.language
            },
            transient: {
                showLoggingNotification: true,
                ...settings.transient
            }
        };
    }

    /**
     * Gets the current value of a setting
     */
    public getSetting = ( scope: keyof AppSettings, setting: string, defaultValue?: any ): any => {    // eslint-disable-line
        if( scope === "language" ) {
            if( this.settings.language[projectStore.manager.language] ) {
                return this.settings.language[projectStore.manager.language][setting];
            }

            return defaultValue;
        }

        return this.settings[scope][setting] || defaultValue;
    };

    /**
     * Checks if the browser has a "do not track" option set on
     */
    private hasDoNotTrack = (): boolean => {
        return navigator.doNotTrack === "1";
    };

    /**
     * Save settings to localstorage
     */
    private persistSettings = (): void => {
        localStorage?.setItem( SETTINGS_KEY, JSON.stringify( this.settings ) );
    };

    /**
     * Sets and saves a setting
     */
    public saveSetting = ( scope: keyof AppSettings, setting: string, value: any ): void => {    // eslint-disable-line
        if( scope === "language" ) {
            if( !this.settings.language[projectStore.manager.language] ) {
                this.settings.language[projectStore.manager.language] = {};
            }

            this.settings.language[projectStore.manager.language][setting] = value;
        }
        else {
            this.settings[scope][setting] = value;
        }

        this.persistSettings();
    };
}

export default new SettingsStore();
