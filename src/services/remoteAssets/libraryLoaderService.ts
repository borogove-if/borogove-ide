import Axios from "axios";
import materialsStore, { MaterialsFileType } from "stores/materialsStore";

interface MaterialManifest {
    files: ManifestFile[];
    includePaths: string[];
    version: number;
}

interface ManifestFile {
    path: string;
    type: "code" | "text" | "image" | "audio" | "data" | "folder";
    url?: string;
}

const typeMap = {
    code: MaterialsFileType.code,
    text: MaterialsFileType.text,
    image: MaterialsFileType.image,
    audio: MaterialsFileType.audio,
    data: MaterialsFileType.data,
    folder: MaterialsFileType.folder
};

export async function loadRemoteLibraryFiles( sourceUrl: string, manifestFile: string ): Promise<void> {
    const manifestRequest = await Axios.get( sourceUrl + "/" + manifestFile );
    const manifest: MaterialManifest = manifestRequest.data;
    const { files, includePaths } = manifest;

    if( manifest.version !== 1 ) {
        throw new Error( "Unknown or missing manifest revision" );
    }

    await Promise.all( files.map( async( file: string | ManifestFile ) => {
        let filename;
        let sourcePath;
        let isBinary;
        let type;

        if( typeof file === "string" ) {
            filename = file;
            sourcePath = file;
            isBinary = false;
            type = MaterialsFileType.code;
        }
        else {
            filename = file.path;
            sourcePath = file.url || file.path;
            isBinary = file.type && file.type !== "code" && file.type !== "text";
            type = typeMap[ file.type ];

            if( type === undefined ) {
                type = MaterialsFileType.code;
            }
        }

        const url = sourceUrl + "/" + sourcePath;
        const fileRequest = await Axios.get(
            url,
            { responseType: isBinary ? "arraybuffer" : "text" }
        );

        materialsStore.addMaterialsFile(
            isBinary ? Buffer.from( fileRequest.data ) : fileRequest.data,
            {
                isBinary,
                name: filename,
                type
            });
    }) );

    if( includePaths && Array.isArray( includePaths ) ) {
        includePaths.forEach( path => {
            const folder = materialsStore.findByFullPath( path );

            if( folder ) {
                folder.isIncludePath = true;
            }
        });
    }
}
