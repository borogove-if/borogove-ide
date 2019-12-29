const BrowserFS = require( "browserfs" );   // must be a require() call
import emscriptenLoader from "../remoteAssets/emscriptenLoaderService";
import * as path from "path";

import compilationResultStore, { CompilationStage } from "stores/compilationResultStore";
import projectStore from "stores/projectStore";
import materialsStore from "stores/materialsStore";

import { OUTPUT_TMP_PATH, PROJECT_ROOT_DIR, INPUT_TMP_PATH } from "services/filesystem/filesystemConstants";


function findStoryfile(): string | null {
    const FS = BrowserFS.BFSRequire( "fs" );
    const outputFiles = FS.readdirSync( OUTPUT_TMP_PATH );
    const storyfileExtensions = [ ".ulx", ".gblorb", ".z3", ".z5", ".z8", ".zblorb" ];

    for( const file of outputFiles ) {
        if( storyfileExtensions.indexOf( path.extname( file ) ) > -1 ) {
            return path.join( OUTPUT_TMP_PATH, file );
        }
    }

    return null;
}

export function compileI6( variant: CompilationVariant ): Promise<boolean> {
    compilationResultStore.reset();
    compilationResultStore.isCompiling = true;
    compilationResultStore.setStage( CompilationStage.firstPass );
    let didQuit = false;    // make sure quit() is called only once

    return new Promise( ( resolve ) => {
        const compilerOptions = projectStore.manager.compilerOptions ? projectStore.manager.compilerOptions[ variant ] || [] : [];
        const entryFile = materialsStore.getPath( projectStore.entryFile );
        const includePaths = materialsStore.getIncludePaths( INPUT_TMP_PATH );
        const compilerArguments = [
            path.join( INPUT_TMP_PATH, entryFile ),
            "+include_path=" + includePaths.join( "," ),
            ...compilerOptions
        ];

        compilationResultStore.addToCompilerOutput( "inform6 " + compilerArguments.join( " " ) + "\n\n" );

        emscriptenLoader({
            // EXTRACTED FROM EMSCRIPTEN GENERATED JS FILE
            DYNAMIC_BASE: 5444032,
            DYNAMICTOP_PTR: 201120,
            wasmTableInitial: 32,
            wasmTableMaximum: 32,
            tmCurrent: 200976,
            tmTimezone: 201024,
            functionAlias: {
                environConstructor: "x",
                errnoLocation: "y",
                getDaylight: "z",
                getTimezone: "A",
                getTzname: "B",
                fflush: "C",
                free: null,
                main: "D",
                malloc: "E",
                stackAlloc: "G",
                dynCallVi: "F"
            },
            /////////

            // used by the loader to choose correct internal addresses
            systemId: "inform6",


            arguments: compilerArguments,
            locateFile: ( path: string ) => {
                return `${process.env.REACT_APP_REMOTE_ASSETS_URL}/compilers/inform6/${process.env.REACT_APP_INFORM6_COMPILER_VERSION}/${path}`;
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
    }).then( ( { FS }: any ) => {     // eslint-disable-line
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
