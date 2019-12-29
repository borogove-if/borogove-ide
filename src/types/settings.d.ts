export declare global {
    /**
     * Main settings container
     */
    interface AppSettings {
        editor: EditorSettings;
        logging: LoggingSettings;
        transient: TransientSettings;

        [key: string]: {
            [key: string]: any; // eslint-disable-line
        };
    }

    /**
     * Text editor settings
     */
    interface EditorSettings {
        fontFamily: "monospace" | "sans-serif";
        fontSize: number;
        lineNumbers: boolean;
        minimap: boolean;
        wordBasedSuggestions: boolean;
        wordWrap: boolean;
        wrappingIndent: boolean;
    }

    /**
     * Opt-in/opt-out info for logging
     */
    interface LoggingSettings {
        analytics: boolean;
        errors: boolean;
    }

    /**
     * Remembering which notifications the user has dismissed
     * so that we won't show them again
     */
    interface TransientSettings {
        showLoggingNotification: boolean;
    }
}
