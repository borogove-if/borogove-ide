
import { join } from "path";

import compilationResultStore, { CompilationStage } from "stores/compilationResultStore";
import projectStore from "stores/projectStore";
import materialsStore from "stores/materialsStore";

import { saveFile, saveFolder } from "../filesystem/localFilesystemService";
import { OUTPUT_TMP_PATH } from "../filesystem/filesystemConstants";

import { JsonFileHandler } from "inkjs/compiler/FileHandler/JsonFileHandler";
import { ErrorHandler } from "inkjs//engine/Error";
import { Compiler } from "inkjs/compiler/Compiler";
import { CompilerOptions } from "inkjs/compiler/CompilerOptions";

interface SourceFilePayload {
    type: "file";
    attributes: {
        name: string;
        directory: string;
        contents: string;
        isEntryFile?: boolean;
    }
}

/**
 * Gets all source files (everything that ends with .ink)
 */
const getSourceFiles = (): SourceFilePayload[] => {
    const files = materialsStore.getAllFiles();
    return files
        .filter( file => file.name.endsWith( ".ink" ) )
        .map( file => ({
            type: "file",
            attributes: {
                name: file.name,
                directory: materialsStore.getPath( file ).slice( 0, -file.name.length - 1 ),
                contents: materialsStore.getContents( file ),
                isEntryFile: projectStore.entryFile?.id === file.id
            }
        }) );
};

/**
 * The main function that starts the compilation process.
 */
export async function compileInk(): Promise<boolean> {
    compilationResultStore.reset();
    compilationResultStore.setCompilationStatus( true );
    compilationResultStore.setStage( CompilationStage.firstPass );

    saveFolder( OUTPUT_TMP_PATH );

    const fileHandler = new JsonFileHandler(
        Object.fromEntries(
            getSourceFiles().map( file => ( [ file.attributes.name, file.attributes.contents ] ) )
        )
    );
    const mainInkFile = getSourceFiles().find( file => file.attributes.isEntryFile );
    const mainInkFileName = mainInkFile?.attributes.name || "main.ink";
    const mainInk = fileHandler.LoadInkFileContents( mainInkFileName );

    const errors: string[] = [];
    const errorHandler: ErrorHandler = ( message, _ ) => {
        errors.push( message );
        console.error( message );
    };
    const options = new CompilerOptions(
        mainInkFileName, [], false, errorHandler, fileHandler
    );

    const c = new Compiler( mainInk, options );

    try {

        const rstory = c.Compile();

        if( !rstory ) {
            throw new Error( "*** Compilation failed ***\n" );
        }

        const jsonStory = rstory.ToJson();

        if( jsonStory ){
            const warningMessages = errors.length > 0 ? " with warnings :\n\n" + errors.join( "\n" ) : ".";
            compilationResultStore.setCompilerOutput( "Successfully compiled" + warningMessages );
            const localFilename = join( OUTPUT_TMP_PATH, "story.json" );
            saveFile( localFilename, jsonStory, false );

            compilationResultStore.setLocalResults({
                storyfilePath: localFilename,
                success: true
            });

            return true;
        } else {
            throw new Error( "*** JSON Export failed ***" );
        }

    }
    catch( e ) {
        const errorMessage = ( `${e}\n`
            + "*".repeat( `${e}`.length ) + "\n\n"
            + errors.join( "\n" )
        );

        compilationResultStore.setCompilerOutput( errorMessage );
        compilationResultStore.setLocalResults({
            storyfilePath: null,
            success: false
        });
        return false;
        return false;
    }
}
