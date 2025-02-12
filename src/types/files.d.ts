import { MaterialsFileType } from "stores/materialsStore";

export declare global {
    // What a file can contain: string for text files, ArrayBuffer for binary files
    type FileContents = string | ArrayBuffer | null;

    // A file in the virtual filesystem
    interface FilesystemFile {
        filename: string;
        path: string;
        size: number;
    }

    // A file in the IDE's file manager
    interface MaterialsFile {
        children?: MaterialsFile[];
        compilationIndex?: number; // Priority in compilation
        displayName?: string; // File name alias shown to the user – currently only for I7's story.ni --> "Source Text"
        id: string;
        isBinary?: boolean;
        isIncludePath?: boolean;
        isOpen?: boolean; // Folders only
        locked?: boolean; // If true, the user can't move, rename or delete the file
        name: string;
        parent?: MaterialsFile | string | null;
        type: MaterialsFileType;
    }
}
