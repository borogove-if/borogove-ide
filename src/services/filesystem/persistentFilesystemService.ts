import { join } from "path";
import { reaction } from "mobx";

import editorStateStore from "stores/editorStateStore";
import materialsStore from "stores/materialsStore";
import projectStore from "stores/projectStore";

import { getFS } from "./localFilesystemService";
import { PERSISTENT_FILESYSTEM_DIR, PROJECT_ROOT_DIR, BOROGOVE_SETTINGS_FILE } from "./filesystemConstants";


const DEBOUNCE_DURATION = 1000; // how often to start the persist operation, maximum

async function copyRecursively( fs: any, sourceRoot: string, source: string, target: string ): Promise<void> { // eslint-disable-line
    const relativeSourcePath = source.replace( sourceRoot, "" );
    const targetPath = join( target, relativeSourcePath );

    await rmRecursively( fs, targetPath );

    return new Promise( ( resolve ) => fs.stat( source, ( _err: any, stats: any ) => {  // eslint-disable-line
        if( stats && stats.isDirectory() ) {
            fs.mkdir( join( target, relativeSourcePath ), () => {
                fs.readdir( source, async ( _err: any, files: any ) => { // eslint-disable-line
                    await Promise.all( files.map( ( file: string ) => copyRecursively( fs, sourceRoot, join( source, file ), target ) ) );
                    resolve();
                });
            });
        }
        else {
            fs.readFile( source, {}, ( _err: any, contents: any ) => {    // eslint-disable-line
                fs.writeFile( targetPath, contents, {}, resolve );
            });
        }
    }) );
}

interface SettingsFile {
    version: number;
    editor: {
        file?: string;
    };
    entryFile: string | null;
    files: MaterialsFile[];
}

function createSettingsFile(): string {
    const data: SettingsFile = {
        version: 1,
        editor: {
            file: editorStateStore.file?.id
        },
        entryFile: projectStore.entryFile ? projectStore.entryFile.id : null,
        files: materialsStore.serialize()
    };

    return JSON.stringify( data );
}

function rmRecursively( fs: any, filepath: string ): Promise<void> {    // eslint-disable-line
    return new Promise( ( resolve ) => {
        try {
            fs.stat( filepath, ( err: any, stats: any ) => {  // eslint-disable-line
                if( err || !stats ) {
                    resolve();
                    return;
                }

                if( !stats.isDirectory() ) {        // normal file - just delete and return
                    fs.unlink( filepath );
                    resolve();
                    return;
                }

                // get a list of files in the directory
                fs.readdir( filepath, async( _err: any, files: any ) => {   // eslint-disable-line
                    // ignore . and ..
                    await Promise.all(
                        files.filter( ( file: string ) => !file.startsWith( "." ) )
                        // delete normal files and delete directories
                            .map( ( file: string ) => new Promise( ( resolve ) => {
                                const fullPath = join( filepath, file );

                                fs.stat( filepath, async ( _err: any, stats: any ) => {  // eslint-disable-line
                                    if( stats.isDirectory() ) {        // normal file - just delete and return
                                        await rmRecursively( fs, fullPath );
                                        resolve( null );
                                    }
                                    else {
                                        fs.unlink( fullPath, resolve );
                                    }
                                });
                            }) )
                    );

                    // The directory is now empty and can be deleted
                    fs.rmdir( filepath, resolve );
                });
            });
        }
        catch( e ) {
            // do nothing, errors are normal if the directory didn't exist
            resolve();
        }
    });
}

export async function persistFS( projectId: string ): Promise<void> {
    const fs: any = getFS();    // eslint-disable-line
    const persistentRoot = join( PERSISTENT_FILESYSTEM_DIR, projectId );

    await copyRecursively( fs, PROJECT_ROOT_DIR, PROJECT_ROOT_DIR, persistentRoot );

    fs.writeFile(
        join( persistentRoot, BOROGOVE_SETTINGS_FILE ),
        createSettingsFile(),
        { encoding: "utf8" }
    );
}

export async function restoreFS( projectId: string ): Promise<void> {
    const fs: any = getFS();    // eslint-disable-line
    const persistentRoot = join( PERSISTENT_FILESYSTEM_DIR, projectId );
    let fileToOpen: MaterialsFile | undefined | null;

    await new Promise( ( resolve, reject ) => {
        fs.readFile(
            join( persistentRoot, BOROGOVE_SETTINGS_FILE ),
            { encoding: "utf8" },
            ( err: Error | null, contents: string ) => {
                if( !contents || err ) {
                    reject();
                    return;
                }

                try {
                    const settings: SettingsFile = JSON.parse( contents );

                    materialsStore.restoreFS( settings.files );

                    if( settings.editor.file ) {
                        fileToOpen = materialsStore.findById( settings.editor.file );
                    }

                    if( settings.entryFile ) {
                        projectStore.setEntryFile( materialsStore.findById( settings.entryFile ) );
                    }

                    resolve( null );
                }
                catch( e ) {
                    console.error( e );
                    materialsStore.restoreFS( [] );
                    reject();
                }

            }
        );
    });

    await copyRecursively( fs, persistentRoot, persistentRoot, PROJECT_ROOT_DIR );

    if( fileToOpen ) {
        editorStateStore.openFile( fileToOpen );
    }
}

let debounceTimer: number;

export function startPersisting( projectId: string ): () => void {
    const persistenceFunction = (): void => {
        clearTimeout( debounceTimer );
        debounceTimer = window.setTimeout( () => persistFS( projectId ), DEBOUNCE_DURATION );
    };

    reaction(
        () => materialsStore.files.map( file => ({ ...file }) ),    // react whenever a file metadata changes
        persistenceFunction,
        {
            fireImmediately: true
        }
    );

    return persistenceFunction;
}
