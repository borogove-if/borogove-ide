import { InterpreterIdentifier } from "services/interpreters/interpreterService";
import { loadRemoteLibraryFiles } from "services/remoteAssets/libraryLoaderService";
import { setProjectTags, pageView } from "services/app/loggers";
import { isSnippetsVariant } from "services/app/env";
import { restoreFS } from "services/filesystem/persistentFilesystemService";
import { isMobileWidth } from "services/ide/environmentService";

import editorStateStore from "stores/editorStateStore";
import ideStateStore from "stores/ideStateStore";
import materialsStore, { MaterialsFileType } from "stores/materialsStore";
import projectStore, { ProjectStoreState } from "stores/projectStore";

import ProjectTemplate from "./ProjectTemplate.class";


/**
 * The project service which defines and sets up a project
 */
export default abstract class ProjectService {
    // The function that compiles the project
    public abstract compile: ( variant: CompilationVariant ) => Promise<boolean>;

    // The internal id of the project type. Shown in the URL.
    public abstract id: string;

    // Which interpreter the project uses
    public abstract interpreter: InterpreterIdentifier;

    // The name of the programming language. This should match the Monaco editor
    // language names (see editorStateStore).
    public abstract language: string;

    // The name of the project. This is shown as the title in the New Project page. Must match the names used in Borogove.io.
    public abstract name: string;

    // Options passed to the compiler, debug and release variants separately
    public compilerOptions?: {
        [key in CompilationVariant]: string[];
    };

    // The type of the compilation report. This is "simple" for everything else
    // other than Inform 7 which uses reporting that tells the status of each
    // stage of the compilation.
    public compilerReportType: "staged" | "simple" = "simple";

    // List of all available compiler versions
    public compilerVersions?: string[];

    // Should the file manager be initially open?
    public fileManagerStartsOpen = true;

    // What type of story files this format produces
    // true: binary, false: text (UTF-8)
    public hasBinaryStoryFiles = true;

    // Does the editor have syntax highlighting for this language
    public hasSyntaxHighlighting = false;

    // Virtual paths to pass to the compiler as search paths
    public includePaths?: string[];

    // Which library version the project uses (for now only for Vorple)
    public libraryVersions?: string[];

    // Does the order of source files matter?
    public orderedFiles = false;

    // Optional function that processes the story file for web site release
    public processReleaseFile: ( name: string, content: Blob ) => Promise<{ name: string; content: Blob }>;

    // Project-specific settings page
    public projectSettingsPage?: JSX.Element;

    // Should the filesystem show compiler options (setting main entry point and include paths)
    public showFilesystemCompilerOptions = true;

    // Id for the story file format, must match what Borogove.io uses
    public storyFileFormat: string;

    // The optional subtitle shown on the New Project page below the title
    public subtitle?: string;

    // Language-specific settings page
    public systemSettingsPage?: JSX.Element;

    // Does pressing the tab button insert tab characters (true) or spaces (false)?
    public tabIndent = false;

    // The template id that was used to initialize the project
    public template: string;

    // Project templates (see ProjectTemplate.class.ts).
    // There should be at least one template here.
    public templates: ProjectTemplate[] = [];

    // The contents of the welcome page that opens when the project has been started.
    public welcomePage?: React.FC;

    /**
     * Adds the template's initial files to the project
     */
    protected addFiles( files: ( MaterialsFile & { contents?: string })[] ): void {
        files.forEach( ( file: MaterialsFile & { contents?: string }, index: number ) => {
            if( file.type === MaterialsFileType.folder ) {
                materialsStore.addFolder( file.name );
            }
            else {
                const thisFile = materialsStore.addMaterialsFile( file.contents || "", file );

                // Open the first file in the editor and make it the entry file
                if( index === 0 ) {
                    materialsStore.openFile( thisFile );
                    projectStore.setEntryFile( thisFile );
                }
            }
        });
    }

    /**
     * Determines which files should be included in the web release package,
     * in addition to the interpreter files and the story file.
     * The list of all materials files (excluding folders) is passed to this
     * function and it returns the list of files that should be included.
     * By default no files are included.
     */
    public filterReleaseFiles = ( _files: MaterialsFile[] ): MaterialsFile[] => [];

    protected async init( template?: ProjectTemplate, preferRestore = false ): Promise<boolean> {
        projectStore.setState( ProjectStoreState.loading );
        projectStore.setManager( this );

        // save project metadata to error logging
        setProjectTags( this );

        // mark this as a page view
        pageView( "/ide/" + this.id );

        // hide the file manager if it shouldn't be open at the start
        // either because the project setting says so or we're in snippets mode
        if( !this.fileManagerStartsOpen || isSnippetsVariant ) {
            ideStateStore.toggleFileManager( false );
        }

        if( preferRestore ) {
            const restoreSuccess = await this.restoreProject();

            if( restoreSuccess ) {
                return true;
            }
        }

        if( template ) {
            this.template = template.id;
            return await this.initTemplate( template );
        }
        else {
            return await this.restoreProject();
        }
    }


    /**
     * Project initialization common for all projects.
     * Return true if files were loaded successfully, otherwise false.
     */
    protected async initTemplate( template: ProjectTemplate ): Promise<boolean> {
        if( template.initialCursorPosition ) {
            editorStateStore.initialCursorPosition = template.initialCursorPosition;
        }

        this.addFiles( template.files );

        if( template.remoteAssets && template.remoteAssets.length > 0 ) {
            try {
                await Promise.all( template.remoteAssets.map( resource => ( typeof resource === "string" )
                    ? loadRemoteLibraryFiles( resource, "manifest.json" )
                    : loadRemoteLibraryFiles( resource.url, resource.manifest )
                ) );
            }
            catch( e ) {
                console.log( e );
                return false;
            }
        }

        return true;
    }


    /**
     * The function that initializes the project when the user has chosen it.
     * If a project template is given, starts with that template instead of loading an existing project.
     * If preferRestore is set, tries to restore a project if it exists even if template was given and loads the template only if that failed.
     */
    public initProject = async( template?: ProjectTemplate, preferRestore = false ): Promise<void> => {
        const status = await this.init( template, preferRestore );

        if( status ) {
            // on mobile sizes always start with the file manager closed
            if( isMobileWidth() && ideStateStore.fileManagerOpen ) {
                ideStateStore.toggleFileManager();
            }

            projectStore.setReady();
        }
        else {
            projectStore.setState( ProjectStoreState.error );
        }
    };


    /**
     * Restores a saved project
     */
    protected restoreProject = async(): Promise<boolean> => {
        try {
            await restoreFS( this.id );
            return true;
        }
        catch( e ) {
            console.log( e );
            return false;
        }
    };
}
