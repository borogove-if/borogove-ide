import { join } from "path";

import compilationResultStore, { CompilationStage } from "stores/compilationResultStore";
import materialsStore from "stores/materialsStore";
import { saveFolder, saveFile } from "../filesystem/localFilesystemService";
import { OUTPUT_TMP_PATH } from "../filesystem/filesystemConstants";

import { compileGame } from "dendry/lib/parsers/compiler";

interface SourceFilePayload {
    name: string;
    contents: string;
}

type DendryGame = unknown;

/**
 * Gets all source files (everything that ends with .dry)
 */
const getSourceFiles = (): SourceFilePayload[] => {
    const files = materialsStore.getAllFiles();
    return files
        .filter( file => file.name.endsWith( ".dry" ) )
        .map( file => ({
            name: file.name,
            contents: materialsStore.getContents( file )
        })
        );
};

/**
 * The main function that starts the compilation process.
 */
export async function compileDendry(): Promise<boolean> {
    compilationResultStore.reset();
    compilationResultStore.setCompilationStatus( true );
    compilationResultStore.setStage( CompilationStage.firstPass );

    saveFolder( OUTPUT_TMP_PATH );

    try {

        const files = getSourceFiles();

        const _compileGame: ( () => Promise<DendryGame> ) = () => ( new Promise( ( resolve, reject ) => {
            compileGame( files, function( err: string, game: DendryGame ) {
                if( err ){
                    reject( err );
                    return;
                }
                resolve( game );
            });
        }) );

        const convertGameToJSON: ( ( game: DendryGame ) => string ) = ( game ) => {
            const replacer: ( ( key: string, value: unknown ) => unknown ) = ( key: string, value: unknown ) => {
                if( key === "$metadata" ) {
                    return undefined;
                } else if( value instanceof Function ) {
                    const source = ( value as unknown as {source:string}).source;
                    return { $code: source };
                } else {
                    return value;
                }
            };

            return JSON.stringify( game, replacer, 0 );
        };

        const game = await _compileGame();
        const gameJSON = convertGameToJSON( game );

        const localFilename = join( OUTPUT_TMP_PATH, "game.json" );

        saveFile( localFilename, gameJSON, false );

        compilationResultStore.setLocalResults({
            storyfilePath: localFilename,
            success: true
        });

        return true;
    }
    catch( e ) {
        const errorMessage = `${e}` as string;
        compilationResultStore.setCompilerOutput( errorMessage );
        compilationResultStore.setLocalResults({
            storyfilePath: null,
            success: false
        });
        return false;
    }

}
