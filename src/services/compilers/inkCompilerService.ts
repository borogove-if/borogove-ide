import axios, { AxiosError, AxiosResponse } from "axios";
import { join } from "path";

import compilationResultStore, { CompilationStage, RemoteCompilationResultResponse } from "stores/compilationResultStore";
import projectStore from "stores/projectStore";
import materialsStore from "stores/materialsStore";
import ideStateStore from "stores/ideStateStore";
import { saveFile, saveFolder } from "../filesystem/localFilesystemService";
import { OUTPUT_TMP_PATH } from "../filesystem/filesystemConstants";

const API_URL = process.env.REACT_APP_INK_COMPILER_SERVICE_URL;

interface SourceFilePayload {
    type: "file";
    attributes: {
        name: string;
        directory: string;
        contents: string;
        isEntryFile?: boolean;
    }
}

/**
 * Gets all source files (everything that ends with .ink)
 */
const getSourceFiles = (): SourceFilePayload[] => {
    const files = materialsStore.getAllFiles();
    return files
        .filter( file => file.name.endsWith( ".ink" ) )
        .map( file => ({
            type: "file",
            attributes: {
                name: file.name,
                directory: materialsStore.getPath( file ).slice( 0, -file.name.length - 1 ),
                contents: materialsStore.getContents( file ),
                isEntryFile: projectStore.entryFile?.id === file.id
            }
        }) );
};

/**
 * The main function that starts the compilation process.
 */
export async function compileInk(): Promise<boolean> {
    compilationResultStore.reset();
    compilationResultStore.setCompilationStatus( true );
    compilationResultStore.setStage( CompilationStage.firstPass );

    saveFolder( OUTPUT_TMP_PATH );

    try {
        const response: AxiosResponse<RemoteCompilationResultResponse> = await axios.post(
            `${API_URL}/compile`,
            {
                data: {
                    language: "Ink",
                    sessionId: ideStateStore.sessionId,
                    uuid: projectStore.uuid
                },
                included: getSourceFiles()
            }
        );

        compilationResultStore.setCompilerOutput( response.data.data?.attributes?.output || "" );

        const localFilename = join( OUTPUT_TMP_PATH, "story.json" );

        if( !response.data?.data?.attributes?.storyfile ) {
            throw new Error( "Invalid Ink compiler response" );
        }

        saveFile( localFilename, response.data.data.attributes.storyfile, false );

        compilationResultStore.setLocalResults({
            storyfilePath: localFilename,
            success: true
        });

        return true;
    }
    catch( e ) {
        const axiosError = e as AxiosError;
        const response: AxiosResponse<RemoteCompilationResultResponse> | undefined = axiosError.response;
        let errorMessage = "";

        if( !response?.data?.data?.attributes?.output ) {
            errorMessage = "Unknown error: " + axiosError.message;
        }
        else {
            errorMessage = response.data.data.attributes.output;
        }

        compilationResultStore.setCompilerOutput( errorMessage );
        compilationResultStore.setLocalResults({
            storyfilePath: null,
            success: false
        });
        return false;
    }
}
