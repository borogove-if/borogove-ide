const BrowserFS = require("browserfs");
import { resolve, join, basename, dirname } from "path";
import { saveAs } from "file-saver";
import JSZip from "jszip";

import { PERSISTENT_FILESYSTEM_DIR } from "./filesystemConstants";

let fs: any = null;

export function getFS(): any {
    return fs;
}

export async function initFS(): Promise<void> {
    return new Promise((resolve, reject) =>
        BrowserFS.configure(
            {
                fs: "MountableFileSystem",
                options: {
                    // working directories, exist only during one session
                    "/": {
                        fs: "InMemory",
                        options: {}
                    },
                    // persistent directories, exist indefinitely
                    [PERSISTENT_FILESYSTEM_DIR]: {
                        fs: "IndexedDB",
                        options: {}
                    }
                }
            },
            (e: Error) => {
                if (e) {
                    console.error("Can't mount filesystem: ", e);
                    reject(e);
                } else {
                    fs = BrowserFS.BFSRequire("fs");
                    resolve();
                }
            }
        )
    );
}

export function moveFile(from: string, to: string): void {
    fs.renameSync(from, join(to, basename(from)));
}

export function readDir(directory: string): FilesystemFile[] {
    const files = fs.readdirSync(directory);

    return files
        .filter((filename: string) => !filename.startsWith("."))
        .map((filename: string) => {
            const path = join(directory, filename);
            const size = fs.statSync(path).size;

            return { filename, path, size };
        });
}

export function readFile(file: string, isBinary = false): string | Uint8Array {
    if (!fs) {
        throw new Error("Filesystem hasn't been initialized");
    }

    return fs.readFileSync(file, isBinary ? undefined : "utf8");
}

export function readFileAsBase64(file: string): string {
    const buffer = readFile(file, true);

    if (typeof buffer === "string") {
        return window.btoa(buffer);
    }

    const len = buffer.byteLength;

    let binary = "";

    for (let i = 0; i < len; ++i) {
        binary += String.fromCharCode(buffer[i]);
    }

    return window.btoa(binary);
}

export function recursiveRm(filepath: string): void {
    try {
        if (!fs.statSync(filepath).isDirectory()) {
            // normal file - just delete and return
            fs.unlinkSync(filepath);
            return;
        }
    } catch (e) {
        // file not found - do nothing
        return;
    }

    try {
        // get a list of files in the directory
        fs.readdirSync(filepath)
            // ignore . and ..
            .filter((file: string) => !file.startsWith("."))
            // delete normal files and delete directories
            .forEach((file: string) => {
                const fullPath = join(filepath, file);

                if (fs.statSync(fullPath).isDirectory()) {
                    recursiveRm(fullPath);
                } else {
                    fs.unlinkSync(fullPath);
                }
            });

        // The directory is now empty and can be deleted
        fs.rmdirSync(filepath);
    } catch (e) {
        // do nothing, errors are normal if the directory didn't exist
    }
}

export function renameFile(filepath: string, newName: string): void {
    if (!fs) {
        throw new Error("Filesystem hasn't been initialized");
    }

    fs.renameSync(filepath, join(dirname(filepath), newName));
}

export function saveFile(
    filepath: string,
    contents: FileContents,
    isBinary = true
): void {
    if (!fs) {
        throw new Error("Filesystem hasn't been initialized");
    }

    fs.writeFileSync(filepath, contents, isBinary ? undefined : "utf8");
}

export function saveFolder(folderpath: string): void {
    if (!fs) {
        throw new Error("Filesystem hasn't been initialized");
    }

    const parentDir = resolve(folderpath, "..");

    if (parentDir && !fs.existsSync(parentDir)) {
        saveFolder(parentDir);
    }

    try {
        fs.mkdirSync(folderpath);
    } catch (e) {
        // do nothing - folder exists, that's ok
    }
}

export function downloadFile(file: string, isBinary: boolean): void {
    const contents = readFile(file, isBinary);
    const filename = basename(file);

    saveAs(new Blob([contents]), filename);
}

function addToZip(zip: JSZip, path: string, cwd: string): void {
    const filename = path.replace(cwd, "");

    if (fs.statSync(path).isDirectory()) {
        zip.folder(filename);
        const files = fs.readdirSync(path);
        files.forEach((child: string) => addToZip(zip, join(path, child), cwd));
        return;
    }

    zip.file(filename, readFile(path, true));
}

export async function downloadFolder(folder: string): Promise<void> {
    const cwd = resolve(folder, "..");
    const filename = basename(folder) + ".zip";
    const zip = new JSZip();

    addToZip(zip, folder, cwd);

    const downloadable = await zip.generateAsync({ type: "blob" });
    saveAs(downloadable, filename);
}
