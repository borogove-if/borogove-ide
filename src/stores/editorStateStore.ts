import { observable, action } from "mobx";
import { IPosition } from "monaco-editor";
import { extname } from "path";

import { openTab } from "services/ide/tabService";

import materialsStore from "./materialsStore";
import projectStore from "./projectStore";

import { TabContentType } from "types/enum";


/**
 * The editor's state: which file it's editing and what's its current contents
 */
class EditorStateStore {
    // The text contents of the editor
    @observable contents = "";

    // The file that's currently open in the editor
    @observable file: MaterialsFile;

    // Which programming language the contents are written in
    @observable language?: string;

    // Editor theme
    @observable theme = "vs-light";

    // When the editor opens, where should the cursor be placed.
    // Used in project templates.
    initialCursorPosition: IPosition | null = null;


    /**
     * Given a filename, detect which programming language it's in,
     * for the editor to use the correct syntax highlighting
     */
    private detectLanguage( filename: string ): string | undefined {
        const fileExtensionWithDot = extname( filename );

        if( !fileExtensionWithDot ) {
            return "text";
        }

        const fileExtension = fileExtensionWithDot.substr( 1 );

        const knownExtensions: { [key: string]: string[] } = {
            css: [ "css" ],
            html: [ "html", "htm" ],
            hugo: [ "hug", "h", "g" ],
            inform6: [ "inf", "h" ],
            inform7: [ "ni", "i7x" ],
            javascript: [ "js" ],
            markdown: [ "md" ],
            text: [ "txt" ]
        };

        // Prioritize the current project language
        const priorityExtensions = knownExtensions[ projectStore.manager.language ];

        if( priorityExtensions && priorityExtensions.includes( fileExtension ) ) {
            return projectStore.manager.language;
        }

        for( const language in knownExtensions ) {
            if( knownExtensions[language].includes( fileExtension ) ) {
                return language;
            }
        }
    }


    /**
     * Open a file from the file manager in the editor
     */
    @action openFile = ( file: MaterialsFile ): void => {
        this.file = file;
        this.setContents( materialsStore.getContents( file ) );
        openTab( TabContentType.editor, { label: file.displayName || file.name });

        this.language = this.detectLanguage( file.name );
    }


    /**
     * Refresh the editor view (reload contents from currently open file)
     */
    @action refreshView = (): void => {
        const file = materialsStore.getCurrent( this.file );

        if( !file ) {
            return;
        }

        this.setContents( materialsStore.getContents( file ) );
    }


    /**
     * Set the text contents of the editor
     */
    @action setContents = ( code?: FileContents, updateEditor = true ): void => {
        if( typeof code !== "string" ) {
            throw new Error( "Can't set editor contents to " + typeof code );
        }

        if( updateEditor ) {
            this.contents = code;
        }

        materialsStore.updateFile( this.file, code );
        projectStore.persistState();
    }
}

export default new EditorStateStore();