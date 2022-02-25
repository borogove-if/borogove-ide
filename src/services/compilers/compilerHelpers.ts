const BrowserFS = require( "browserfs" );   // must be a require() call
import * as path from "path";

import { getFS, recursiveRm, saveFolder } from "services/filesystem/localFilesystemService";
import { INPUT_TMP_PATH, OUTPUT_TMP_PATH, PROJECT_ROOT_DIR } from "services/filesystem/filesystemConstants";

/**
 * Prepares the filesystem for Emscripten compiler input/output after it has been initialized
 */
export const emscriptenLoaderCallback = ( { FS }: any ) => {     // eslint-disable-line
    // Use BrowserFS's Emscripten compatibility function to
    // mount Borogove's filesystem to Emscripten's filesystem
    // join2 is to fix a BrowserFS bug (https://github.com/jvilk/BrowserFS/issues/270)
    const BFS = new BrowserFS.EmscriptenFS( FS, { join2: path.join, ...path });
    const BorogoveFS = BrowserFS.BFSRequire( "fs" );

    // Delete old output files
    if( getFS().existsSync( OUTPUT_TMP_PATH ) ) {
        recursiveRm( OUTPUT_TMP_PATH );
    }

    saveFolder( OUTPUT_TMP_PATH );

    // Create folders inside Emscripten
    if( FS.createPath ) {
        // newer Emscripten versions
        FS.createPath( FS.root, "input", true, true );
        FS.createPath( FS.root, "output", true, true );
    }
    else {
        // older Emscripten versions
        FS.createFolder( FS.root, "input", true, true );
        FS.createFolder( FS.root, "output", true, true );
    }

    // Change the directory to /output so that Inform will write all output files there
    FS.chdir( OUTPUT_TMP_PATH );

    // Mount BFS's root folder into the input folder.
    FS.mount( BFS, { root: PROJECT_ROOT_DIR }, INPUT_TMP_PATH );

    // Mount the output folder
    if( !BorogoveFS.existsSync( OUTPUT_TMP_PATH ) ) {
        BorogoveFS.mkdirSync( OUTPUT_TMP_PATH );
    }

    FS.mount( BFS, { root: OUTPUT_TMP_PATH }, OUTPUT_TMP_PATH );
};
