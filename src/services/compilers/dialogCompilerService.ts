const BrowserFS = require( "browserfs" );   // must be a require() call
import * as path from "path";

import emscriptenLoader from "../remoteAssets/dialogLoaderService";

import compilationResultStore, { CompilationStage } from "stores/compilationResultStore";
import projectStore from "stores/projectStore";
import materialsStore from "stores/materialsStore";

import { INPUT_TMP_PATH, OUTPUT_TMP_PATH, PROJECT_ROOT_DIR } from "services/filesystem/filesystemConstants";

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
    compilationResultStore.isCompiling = true;
    compilationResultStore.setStage( CompilationStage.firstPass );
    let didQuit = false;    // make sure quit() is called only once

    return new Promise( ( resolve ) => {
        const compilerOptions = projectStore.manager.compilerOptions ? projectStore.manager.compilerOptions[ variant ] || [] : [];
        const includePaths = materialsStore.files.filter( file => file.name.indexOf( ".dg" ) === file.name.length - 3 ).map( file => "/input" + materialsStore.getPath( file ) );
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
        }).then(({ FS }: any) => {     // eslint-disable-line
            // Use BrowserFS's Emscripten compatibility function to
            // mount Borogove's filesystem to Emscripten's filesystem
            // join2 is to fix a BrowserFS bug (https://github.com/jvilk/BrowserFS/issues/270)
            const BFS = new BrowserFS.EmscriptenFS( FS, { join2: path.join, ...path });
            const BorogoveFS = BrowserFS.BFSRequire( "fs" );

            // Create folders inside Emscripten
            FS.createFolder( FS.root, "input", true, true );
            FS.createFolder( FS.root, "output", true, true );

            // Change the directory to /output so that Inform will write all output files there
            FS.chdir( OUTPUT_TMP_PATH );

            // Mount BFS's root folder into the input folder.
            FS.mount( BFS, { root: PROJECT_ROOT_DIR }, INPUT_TMP_PATH );

            // Mount the output folder
            if( !BorogoveFS.existsSync( OUTPUT_TMP_PATH ) ) {
                BorogoveFS.mkdirSync( OUTPUT_TMP_PATH );
            }

            FS.mount( BFS, { root: OUTPUT_TMP_PATH }, OUTPUT_TMP_PATH );
        });
    });
}
