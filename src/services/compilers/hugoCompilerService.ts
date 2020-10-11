const BrowserFS = require( "browserfs" );   // must be a require() call
import * as path from "path";

import emscriptenLoader from "../remoteAssets/emscriptenLoaderService";

import compilationResultStore, { CompilationStage } from "stores/compilationResultStore";
import projectStore from "stores/projectStore";
import materialsStore from "stores/materialsStore";

import { INPUT_TMP_PATH, OUTPUT_TMP_PATH, PROJECT_ROOT_DIR } from "services/filesystem/filesystemConstants";

function findStoryfile(): string | null {
    const FS = BrowserFS.BFSRequire( "fs" );
    const outputFiles = FS.readdirSync( OUTPUT_TMP_PATH );
    const storyfileExtensions = [ ".hex" ];

    for( const file of outputFiles ) {
        if( storyfileExtensions.indexOf( path.extname( file ) ) > -1 ) {
            return path.join( OUTPUT_TMP_PATH, file );
        }
    }

    return null;
}

export function compileHugo( variant: CompilationVariant ): Promise<boolean> {
    compilationResultStore.reset();
    compilationResultStore.setCompilationStatus( true );
    compilationResultStore.setStage( CompilationStage.firstPass );
    let didQuit = false;    // make sure quit() is called only once

    return new Promise( ( resolve ) => {
        const compilerOptions = projectStore.manager.compilerOptions ? projectStore.manager.compilerOptions[ variant ] || [] : [];
        const entryFile = materialsStore.getPath( projectStore.entryFile );
        const includePaths = materialsStore.getIncludePaths( "@lib=" + INPUT_TMP_PATH );
        const compilerArguments = [
            ...compilerOptions,
            ...includePaths,
            path.join( INPUT_TMP_PATH, entryFile ),
            "story.hex"
        ];

        compilationResultStore.addToCompilerOutput( "hc " + compilerArguments.join( " " ) + "\n\n" );

        emscriptenLoader({
            // EXTRACTED FROM EMSCRIPTEN GENERATED JS FILE
            DYNAMIC_BASE: 5276064,
            DYNAMICTOP_PTR: 33152,
            wasmTableInitial: 16,
            wasmTableMaximum: 16,
            tmCurrent: 33008,
            tmTimezone: 33056,
            functionAlias: {
                environConstructor: "z",
                errnoLocation: "A",
                getDaylight: "B",
                getTimezone: "C",
                getTzname: "D",
                fflush: "E",
                free: "F",
                main: "G",
                malloc: "H",
                stackAlloc: "I",
                dynCallVi: null
            },
            /////////

            // used by the loader to choose correct internal addresses
            systemId: "hugo",

            arguments: compilerArguments,

            locateFile: ( path: string ) => {
                return `${process.env.REACT_APP_REMOTE_ASSETS_URL}/compilers/hugo/${process.env.REACT_APP_HUGO_COMPILER_VERSION}/${path}`;
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
