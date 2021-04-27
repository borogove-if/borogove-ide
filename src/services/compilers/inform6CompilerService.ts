const BrowserFS = require( "browserfs" );   // must be a require() call
import * as path from "path";

import compilationResultStore, { CompilationStage } from "stores/compilationResultStore";
import projectStore from "stores/projectStore";
import materialsStore from "stores/materialsStore";

import { OUTPUT_TMP_PATH, INPUT_TMP_PATH } from "services/filesystem/filesystemConstants";

import emscriptenLoader from "../remoteAssets/inform6LoaderService";
import { emscriptenLoaderCallback } from "./compilerHelpers";


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
    compilationResultStore.setCompilationStatus( true );
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
        }).then( emscriptenLoaderCallback );
    });
}
