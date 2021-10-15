import { observable, action, makeObservable, runInAction } from "mobx";
import { dirname, basename, join, extname } from "path";
import { FileWithPath } from "file-selector";
import { isBinary } from "istextorbinary/edition-es2019/index"; /* eslint-disable-line */
import { v4 as uuid } from "uuid";

import editorStateStore from "./editorStateStore";
import ideStateStore from "./ideStateStore";
import settingsStore from "./settingsStore";
import { TabContentType } from "./tabStore";

import { initFS, moveFile, recursiveRm, renameFile, saveFile, saveFolder, downloadFile, downloadFolder, readFile } from "services/filesystem/localFilesystemService";
import { closeTabsByType, openTab } from "services/ide/tabService";
import { PROJECT_ROOT_DIR } from "services/filesystem/filesystemConstants";

export enum FSLoadState {
    initializing,
    unavailable,
    ready
}

export enum MaterialsFileType {
    audio,
    code,
    folder,
    image,
    text,   // other text file
    data    // other binary file
}

/**
 * The project's filesystem (code and materials)
 */
class MaterialsStore {
    files: MaterialsFile[] = [];

    // Filesystem load state
    fsState = FSLoadState.initializing;

    constructor() {
        makeObservable( this, {
            files: observable,
            fsState: observable,
            addMaterialsFile: action,
            addFolder: action,
            getContents: action,
            deleteFile: action,
            moveCompilationOrder: action,
            moveToFolder: action,
            openFile: action,
            processUploads: action,
            rename: action,
            restoreFS: action,
            toggleFolder: action,
            toggleIncludePath: action,
            updateFile: action,
            uploadFiles: action
        });

        initFS().then( () => {
            saveFolder( PROJECT_ROOT_DIR );
            runInAction( () => {
                this.fsState = FSLoadState.ready;
            });
        }).catch( () => {
            runInAction( () => {
                this.fsState = FSLoadState.unavailable;
            });
        });
    }

    // files that are waiting for processing, when the user uploads multiple files at once
    private uploadQueue: FileWithPath[] = [];

    public getFilesystemPath( file: MaterialsFile | string | null ): string {
        const path = ( typeof file === "string" ) ? file : this.getPath( file );

        return join( PROJECT_ROOT_DIR, path );
    }

    public getPath( file: MaterialsFile | null ): string {
        if( !file ) {
            // null is the root dir
            return "/";
        }

        if( !file.parent ) {
            // the file is in root
            return join( "/", file.name );
        }

        const parent = typeof file.parent === "string"
            ? this.findById( file.parent )
            : file.parent;

        // otherwise append this to the parent's path
        return join( this.getPath( parent ), file.name );
    }

    private isBinaryType( type: MaterialsFileType ): boolean {
        return type === MaterialsFileType.audio
            || type === MaterialsFileType.data
            || type === MaterialsFileType.image;
    }

    addMaterialsFile = (
        contents: FileContents,
        { displayName, name, parent = null, locked = false, type = MaterialsFileType.code, isBinary }:
        MaterialsFile | { displayName?: string; name: string; parent?: MaterialsFile | null; locked?: boolean; type?: MaterialsFileType; isBinary?: boolean }
    ): MaterialsFile => {
        const parentFile = typeof parent === "string" ? this.findById( parent ) : parent;
        let folderPath = parent ? this.getPath( parentFile ) : "/";
        let filename = name;

        if( filename.indexOf( "/" ) > -1 ) {
            folderPath = dirname( filename );
            filename = basename( filename );
        }

        // this.addFolder will return the existing folder if there is one, or the one it just created
        const parentMaterialsFile = this.addFolder( folderPath );

        // the file's path on the filesystem
        const filesystemPath = join( PROJECT_ROOT_DIR, folderPath, filename );

        const saveAsBinary = typeof isBinary === "undefined" ? this.isBinaryType( type ) : isBinary;

        // save the file into the filesystem
        saveFile( filesystemPath, contents, saveAsBinary );  // TODO Error checking

        // create the MaterialsFile object
        const file: MaterialsFile = {
            displayName,
            id: uuid(),
            isBinary: saveAsBinary,
            locked,
            name: filename,
            parent: parentMaterialsFile,
            type
        };

        this.files.push( file );

        return file;
    };

    /**
     * Recursively add a new folder.
     */
    addFolder = ( folderPath: string ): MaterialsFile | null => {
        if( !folderPath || folderPath === "/" ) {
            return null;
        }

        const existingFolder = this.findByFullPath( folderPath );
        const name = basename( folderPath );

        if( existingFolder ) {
            if( existingFolder.type !== MaterialsFileType.folder ) {
                throw new Error( folderPath + " already exists but is not a folder" );
            }

            return existingFolder;
        }

        // list of all folder ancestors
        const parents = folderPath.split( "/" ).filter( name => name );

        // remove the folder itself from the list
        parents.pop();

        let parent;

        // recursively add the folders, starting from the root
        parents.reduce( ( previousValue, currentValue ) => {
            const path = previousValue + "/" + currentValue;

            // Conveniently we can get the parent Materials file here.
            // The last iteration contains the direct parent.
            parent = this.addFolder( path );
            return path;
        }, "" );

        saveFolder( join( PROJECT_ROOT_DIR, folderPath ) );  // TODO Error checking

        const newFolder: MaterialsFile = {
            id: uuid(),
            isOpen: false,
            name,
            parent,
            type: MaterialsFileType.folder
        };

        this.files.push( newFolder );

        return newFolder;
    };

    deleteFile = ( file: MaterialsFile ): boolean => {
        const fileIndex: number = this.files.findIndex( f => f.id === file.id );

        if( fileIndex === -1 ) {
            return false;
        }

        this.files.splice( fileIndex, 1 );
        recursiveRm( this.getFilesystemPath( file ) );

        // close the editor if we just deleted a file that was open there
        const editorFile = editorStateStore.file;

        if( editorFile && !this.findById( editorFile.id ) ) {
            closeTabsByType( TabContentType.editor );
        }

        return true;
    };

    private detectFiletype = ( filename: string, defaultType: MaterialsFileType ): MaterialsFileType => {
        const extension = extname( filename ).toLowerCase();

        switch( extension ) {
            case ".png":
            case ".jpg":
            case ".jpeg":
            case ".gif":
            case ".webm":
                return MaterialsFileType.image;

            case ".mp3":
            case ".wav":
                return MaterialsFileType.audio;

            case ".txt":
            case ".md":
                return MaterialsFileType.text;
        }

        return defaultType;
    };

    /**
     * Download a single file, or download a folder as a zip file.
     */
    public download = ( file: MaterialsFile ): void => {
        if( file.type === MaterialsFileType.folder ) {
            downloadFolder( this.getFilesystemPath( file ) );
        }
        else {
            downloadFile( this.getFilesystemPath( file ), file.isBinary === undefined ? true : file.isBinary );
        }
    };


    /**
     * Download the entire project
     */
    public downloadProject = (): void => {
        downloadFolder( PROJECT_ROOT_DIR );
    };


    /**
     * All files (no folders)
     */
    public getAllFiles = (): MaterialsFile[] => this.files.filter( file => file.type !== MaterialsFileType.folder );


    /**
     * Get a list of all folders
     */
    public getAllFolderPaths = (): string[] => {
        const folders = this.files
            .filter( file => file.type === MaterialsFileType.folder )
            .map( folder => this.getPath( folder ) )
            .sort();

        // add the root
        folders.unshift( "/" );

        return folders;
    }


    /**
     * Returns a "fresh" copy (a reference to the file that's currently being stored)
     * so that we'll modify the actual object elsewhere. MobX can change object
     * references in some cases.
     */
    public getCurrent = ( file: MaterialsFile ): MaterialsFile | null => this.findById( file.id );


    /**
     * Put the files in a neat tree structure
     */
    public getFileTree = ( parent?: MaterialsFile ): MaterialsFile[] => {
        const children = ( parent
            ? JSON.parse( JSON.stringify( this.files.filter( file => file.parent && ( typeof file.parent === "string" ? file.parent : file.parent.id ) === parent.id ) ) )
            : JSON.parse( JSON.stringify( this.files.filter( file => !file.parent ) ) ) )
            .sort( ( file1: MaterialsFile, file2: MaterialsFile ) => {
                // if compilation ordering exists, sort by that first
                if( typeof file1.compilationIndex === "number" || typeof file2.compilationIndex === "number" ) {
                    // files with no ordering index go to the bottom
                    if( typeof file1.compilationIndex !== "number" ) {
                        return 1;
                    }

                    if( typeof file2.compilationIndex !== "number" ) {
                        return -1;
                    }

                    return file1.compilationIndex - file2.compilationIndex;
                }

                // prioritize folders
                if( file1.type !== file2.type ) {
                    if( file1.type === MaterialsFileType.folder ) {
                        return -1;
                    }

                    if( file2.type === MaterialsFileType.folder ) {
                        return 1;
                    }
                }

                // then sort by filename by default
                const sortName1 = ( file1.displayName || file1.name ).toLowerCase();
                const sortName2 = ( file2.displayName || file2.name ).toLowerCase();

                return sortName1.localeCompare( sortName2 );
            });

        children.filter( ( file: MaterialsFile ) => file.type === MaterialsFileType.folder )
            .forEach( ( file: MaterialsFile ) => file.children = this.getFileTree( file ) );

        return children;
    };


    /**
     * Find a material file by its full file manager path
     */
    public findByFullPath = ( fullPath: string ): MaterialsFile | null => this.files.find( file => this.getPath( file ) === join( "/", fullPath ) ) || null;


    /**
     * Find a material file by its id
     */
    public findById = ( id: string ): MaterialsFile | null  => this.files.find( file => file.id === id ) || null;

    public getContents = ( file: MaterialsFile ): string => {
        return readFile( this.getFilesystemPath( file ), false ) as string;
    }

    public getIncludePaths = ( root: string ): string[] => this.files.filter( file => file.isIncludePath ).map( file => join( root, this.getPath( file ) ) );


    /**
     * Check if two material files are the same, accepts either a MaterialsFile, an id as a string, or null/undefined
     */
    public isSameFile = ( file1: MaterialsFile | string | undefined | null, file2: MaterialsFile | string | undefined | null ): boolean => {
        if( !file1 || !file2 ) {
            return ( file1 || null ) === ( file2 || null );
        }

        const id1 = typeof file1 === "string" ? file1 : file1.id;
        const id2 = typeof file2 === "string" ? file2 : file2.id;

        return id1 === id2;
    };


    /**
     * (Re)calculate all compilation indexes
     */
    public setCompilationIndexes = ( parent?: MaterialsFile, startIndex = 0 ): number => {
        const tree = this.getFileTree( parent );

        tree.forEach( ( item, index ) => {
            const file = this.findById( item.id );

            if( file ) {
                file.compilationIndex = index + startIndex;

                if( file.type === MaterialsFileType.folder ) {
                    startIndex = this.setCompilationIndexes( file, index + startIndex );
                }
            }
        });

        return startIndex + tree.length;
    };


    /**
     * Change the compilation order by moving the file up or down in the compilation order tree
     */
    public moveCompilationOrder = ( target: MaterialsFile, direction: 1 | -1 ): void => {
        const file = this.findById( target.id );

        if( !file ) {
            console.error( "Can't move unknown file" );
            return;
        }

        const parentId = typeof target.parent === "string" ? target.parent : target.parent?.id;
        const tree = this.getFileTree( this.findById( parentId as string ) as MaterialsFile );

        // set the indexes of all files as they now are, to ensure everything has an index
        this.setCompilationIndexes();

        // find the item that the swap would affect
        const thisIndex = tree.findIndex( item => item.id === file.id );
        const swapIndex = thisIndex + direction;

        if( swapIndex < 0 || swapIndex > tree.length ) {
            return;
        }

        const swap = this.findById( tree[ swapIndex ].id );

        if( !swap ) {
            return;
        }

        const thisOrder = file.compilationIndex;
        const swapOrder = swap.compilationIndex;
        file.compilationIndex = swapOrder;
        swap.compilationIndex = thisOrder;
    }


    /**
     * Move a file to another folder
     */
    public moveToFolder = ( from: MaterialsFile, dest: string ): void => {
        const file: MaterialsFile | null = this.findById( from.id );    // make sure we're moving a copy that's in the store
        let target: MaterialsFile | null;

        if( !file ) {
            throw new Error( "Trying to move unknown file" );
        }

        if( !dest || dest === "/" ) {
            target = null;
        }
        else {
            target = this.findByFullPath( dest );
        }

        if( target && target.type !== MaterialsFileType.folder ) {
            throw new Error( "Can't move file to another file" );
        }

        const fromPath = this.getFilesystemPath( file );
        const toPath = this.getFilesystemPath( target );
        moveFile( fromPath, toPath );
        file.parent = target;

        // TODO when moving a folder, must refresh the paths!
    };


    /**
     * Open a file in the editor
     */
    public openFile = ( file?: MaterialsFile | null ): void => {
        if( !file ) {
            return;
        }

        if( file.type === MaterialsFileType.folder ) {
            const storedFile = this.findById( file.id );

            // update the file in the store to trigger UI refresh
            if( storedFile ) {
                storedFile.isOpen = true;
            }
            else {
                file.isOpen = true;
            }
        }
        else {
            editorStateStore.openFile( file );
        }

        const parent = typeof file.parent === "string"
            ? this.findById( file.parent )
            : file.parent;

        // recursively open all parent folders so that the file will be shown on the file manager
        this.openFile( parent );
    };

    // adapted from https://gist.github.com/getify/7325764
    binaryStringToUint8Array( bStr: string ): Uint8Array {
        const len = bStr.length;
        const u8Array = new Uint8Array( len );

        for( let i = 0; i < len; ++i ) {
            u8Array[i] = bStr.charCodeAt( i );
        }

        return u8Array;
    }

    /**
     * Process the next file in the upload queue
     */
    public processUploads = (): void => {
        if( this.uploadQueue.length === 0 ) {
            // nothing to do
            return;
        }

        const file: FileWithPath = this.uploadQueue.shift() as FileWithPath;

        if( !file ) {
            return;
        }

        const reader = new FileReader();

        reader.onabort = (): void => console.log( "file reading was aborted" );
        reader.onerror = (): void => console.log( "file reading has failed" );
        reader.onload = (): void => {
            const binaryStr = reader.result;
            const path = file.path ? file.path.substr( 0, file.path.length - file.name.length - 1 ) : null;
            const nameWithPath = path ? join( path, file.name ) : file.name;
            const parent: MaterialsFile | null = path ? this.addFolder( path ) : null;
            const binary = isBinary( null, binaryStr as Buffer );
            const type = this.detectFiletype( file.name, binary ? MaterialsFileType.data : MaterialsFileType.code );
            const existingFile = path === null ? null : this.findByFullPath( nameWithPath );
            const askBeforeOverwrite = settingsStore.getSetting( "filesystem", "askBeforeOverwrite" );

            if( existingFile ) {
                const overwrite = (): void => {
                    existingFile.type = type;
                    existingFile.isBinary = binary ?? undefined;

                    saveFile( this.getFilesystemPath( existingFile ), binaryStr, binary ?? undefined );

                    if( editorStateStore.file.id === existingFile.id ) {
                        // if the file was open on the editor, re-open it to update the contents
                        editorStateStore.refreshView();
                    }

                    this.processUploads();
                };

                if( askBeforeOverwrite ) {
                    ideStateStore.openModal( "overwriteFile", {
                        filename: nameWithPath,
                        onConfirm: ( alwaysOverwrite: boolean ): void => {
                            if( alwaysOverwrite ) {
                                settingsStore.saveSetting( "filesystem", "askBeforeOverwrite", false );
                            }
                            overwrite();
                        },
                        onCancel: () => {
                            this.processUploads();
                        }
                    });
                }
                else {
                    overwrite();
                }
            }
            else {
                this.addMaterialsFile(
                    binary ? Buffer.from( this.binaryStringToUint8Array( binaryStr as string ) ) : binaryStr,
                    {
                        name: file.name,
                        parent,
                        type,
                        isBinary: binary ?? undefined
                    }
                );
                this.processUploads();
            }
        };

        reader.readAsBinaryString( file );
    };


    /**
     * Rename a file
     */
    public rename = ( fileToRename: MaterialsFile, newName: string ): void => {
        const file: MaterialsFile | null = this.findById( fileToRename.id );    // make sure we're moving a copy that's in the store
        const fromPath = this.getFilesystemPath( file );

        if( !file ) {
            throw new Error( "Trying to rename file that doesn't exist" );
        }

        renameFile( fromPath, newName );
        file.name = newName;

        // if the file is open in the editor, need to re-open it to update the name in the editor tab
        const editorFile = editorStateStore.file;

        // re-check the filetype, in case the extension changed
        file.type = this.detectFiletype( file.name, file.type );

        if( editorFile && editorFile.id === file.id ) {
            editorStateStore.file = file;
            openTab( TabContentType.editor, { label: file.displayName || file.name });
        }
    };

    public restoreFS = ( files: MaterialsFile[] ): void => {
        this.files = files;
    };

    public serialize = (): MaterialsFile[] => {
        return this.files.map( file => ({
            ...file,
            parent: file.parent && ( typeof file.parent === "string" ? file.parent : file.parent.id ),
            children: undefined
        }) );
    };


    /**
     * Open or close a folder
     */
    public toggleFolder = ( file?: MaterialsFile | null ): void => {
        if( !file ) {
            return;
        }

        if( file.type === MaterialsFileType.folder ) {
            const storedFile = this.findById( file.id );

            // update the file in the store to trigger UI refresh
            if( storedFile ) {
                storedFile.isOpen = !storedFile.isOpen;
            }
            else {
                file.isOpen = !file.isOpen;
            }
        }
    };


    /**
     * Toggles whether a folder is included in compilation or not
     */
    public toggleIncludePath = ( file: MaterialsFile ): void => {
        const folder = this.getCurrent( file );

        if( !folder || folder.type !== MaterialsFileType.folder ) {
            return;
        }

        folder.isIncludePath = !folder.isIncludePath;
    };


    /**
     * Update a file's contents
     */
    public updateFile = ( file: MaterialsFile, contents: FileContents ): void => {
        // save changes to the filesystem
        saveFile( this.getFilesystemPath( file ), contents, false );
    };

    public uploadFiles = ( files: FileWithPath[] ): void => {
        this.uploadQueue = files;
        this.processUploads();
    };
}

export default new MaterialsStore();
