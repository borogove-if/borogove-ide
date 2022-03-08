const BrowserFS = require( "browserfs" );   // must be a require() call
import * as path from "path";

import compilationResultStore, { CompilationStage } from "stores/compilationResultStore";
import materialsStore from "stores/materialsStore";
import projectStore from "stores/projectStore";
import settingsStore from "stores/settingsStore";

import { OUTPUT_TMP_PATH } from "services/filesystem/filesystemConstants";

import emscriptenLoader from "../remoteAssets/dialogLoaderService";
import { emscriptenLoaderCallback } from "./compilerHelpers";

function findStoryfile(): string | null {
    const FS = BrowserFS.BFSRequire( "fs" );
    const outputFiles = FS.readdirSync( OUTPUT_TMP_PATH );
    const storyfileExtensions = [ ".aastory" ];

    for( const file of outputFiles ) {
        if( storyfileExtensions.indexOf( path.extname( file ) ) > -1 ) {
            return path.join( OUTPUT_TMP_PATH, file );
        }
    }

    return null;
}

export function compileDialog( variant: CompilationVariant ): Promise<boolean> {
    compilationResultStore.reset();
    compilationResultStore.setCompilationStatus( true );
    compilationResultStore.setStage( CompilationStage.firstPass );
    materialsStore.setCompilationIndexes();

    let didQuit = false;    // make sure quit() is called only once

    return new Promise( ( resolve ) => {
        const compilerOptions = settingsStore.getSetting( "language", variant + "CompilerOptions", projectStore.manager.compilerOptions?.[ variant ] ) || [];
        const includePaths = materialsStore.files
            .filter( file => file.name.indexOf( ".dg" ) === file.name.length - 3 )
            .sort( ( file1, file2 ) => {
                if( typeof file1.compilationIndex === "number" || typeof file2.compilationIndex === "number" ) {
                    if( typeof file1.compilationIndex !== "number" ) {
                        return 1;
                    }

                    if( typeof file2.compilationIndex !== "number" ) {
                        return -1;
                    }
                }

                return ( file1.compilationIndex || 0 ) - ( file2.compilationIndex || 0 );
            })
            .map( file => "/input" + materialsStore.getPath( file ) );
        const compilerArguments = [
            ...compilerOptions,
            ...includePaths
        ];

        compilationResultStore.addToCompilerOutput( "dialogc " + compilerArguments.join( " " ) + "\n\n" );

        emscriptenLoader({
            // EXTRACTED FROM EMSCRIPTEN GENERATED JS FILE
            DYNAMIC_BASE: 5361792,
            DYNAMICTOP_PTR: 118720,
            wasmTableInitial: 46,
            wasmTableMaximum: 46,
            tmCurrent: 118752,
            tmTimezone: 118800,
            functionAlias: {
                environConstructor: "y",
                errnoLocation: "z",
                getDaylight: "A",
                getTimezone: "B",
                getTzname: "C",
                fflush: "D",
                free: null,
                main: "E",
                malloc: "F",
                stackAlloc: "I",
                stackRestore: "J",
                stackSave: "K",
                dynCallVi: null
            },
            /////////

            // used by the loader to choose correct internal addresses
            systemId: "dialog",

            arguments: compilerArguments,

            locateFile: ( path: string ) => {
                return `${process.env.REACT_APP_REMOTE_ASSETS_URL}/compilers/dialog/${process.env.REACT_APP_DIALOG_COMPILER_VERSION}/${path}`;
            },
            onAbort: () => {
                // TODO: compiler crashed, must reload page!
                console.error( "Emscripten aborted" );
            },
            print: ( text: string ) => {
                console.log( "- STDOUT:", text );
                compilationResultStore.addToCompilerOutput( text + "\n" );
            },
            printErr: ( text: string ) => {
                console.log( "* STDERR:", text );
                compilationResultStore.addToCompilerOutput( text + "\n" );
            },
            quit: ( errcode: number ) => {
                if( didQuit ) {
                    return;
                }

                didQuit = true;

                console.log( "EMSCRIPTEN QUIT", errcode );
                const success: boolean = errcode === 0;

                compilationResultStore.setLocalResults({
                    storyfilePath: findStoryfile(),
                    success
                });

                // TODO: what if story file isn't found?

                resolve( success );
            }
        }).then( emscriptenLoaderCallback );
    });
}
