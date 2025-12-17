import axios, { AxiosError, AxiosResponse } from "axios";

import compilationResultStore, {
    CompilationStage
} from "stores/compilationResultStore";
import projectStore from "stores/projectStore";
import materialsStore from "stores/materialsStore";
import ideStateStore from "stores/ideStateStore";
import { saveFolder } from "../filesystem/localFilesystemService";
import { OUTPUT_TMP_PATH } from "../filesystem/filesystemConstants";

const API_URL = process.env.REACT_APP_ZIL_COMPILER_SERVICE_URL;

interface SourceFilePayload {
    type: "file";
    attributes: {
        name: string;
        directory: string;
        contents: string;
        isEntryFile?: boolean;
    };
}

/**
 * Gets all source files (everything that ends with .zil)
 */
const getSourceFiles = (): SourceFilePayload[] => {
    const files = materialsStore.getAllFiles();
    return files
        .filter(file => file.name.endsWith(".zil"))
        .map(file => ({
            type: "file",
            attributes: {
                name: file.name,
                directory: materialsStore
                    .getPath(file)
                    .slice(0, -file.name.length - 1),
                contents: materialsStore.getContents(file),
                isEntryFile: projectStore.entryFile?.id === file.id
            }
        }));
};

/**
 * The main function that starts the compilation process.
 */
export async function compileZil(): Promise<boolean> {
    compilationResultStore.reset();
    compilationResultStore.setCompilationStatus(true);
    compilationResultStore.setStage(CompilationStage.uploading);

    saveFolder(OUTPUT_TMP_PATH);

    try {
        const jobId = await prepare();

        if (!jobId) {
            compilationResultStore.setRemoteResults({
                data: {
                    success: false,
                    report: "Could not connect to remote compilation service"
                }
            });

            return false;
        }

        compilationResultStore.setStage(CompilationStage.firstPass);

        const response: AxiosResponse = await axios.get(
            `${API_URL}/compile/${jobId}`,
            {
                data: {
                    language: "zil",
                    sessionId: ideStateStore.sessionId,
                    uuid: projectStore.uuid
                }
            }
        );

        compilationResultStore.setCompilerOutput(response.data?.log || "");

        const storyfileUrl = response.data?.storyfileUrl;

        if (!response.data?.success || !storyfileUrl) {
            throw new Error(
                response.data?.log || "Invalid ZILF compiler response"
            );
        }

        compilationResultStore.setRemoteResults({
            data: { success: true, report: "" },
            links: { storyfile: API_URL + storyfileUrl, index: "" }
        });

        return true;
    } catch (e) {
        console.error(e);
        const axiosError = e as AxiosError;
        const response: AxiosResponse | undefined = axiosError.response;
        let errorMessage = "";

        if (!response?.data?.log) {
            errorMessage = axiosError.message;
        } else {
            errorMessage = response.data.log;
        }

        compilationResultStore.setCompilerOutput(errorMessage);
        compilationResultStore.setLocalResults({
            storyfilePath: null,
            success: false
        });
        return false;
    }
}

/**
 * Prepare for compilation by sending source files to the compiler.
 * The server returns a job id we'll use for further requests.
 */
async function prepare(): Promise<string | null> {
    try {
        const result: AxiosResponse = await axios.post(API_URL + "/prepare", {
            data: {
                language: "zil",
                sessionId: ideStateStore.sessionId,
                uuid: projectStore.uuid
            },
            included: getSourceFiles()
        });

        return result?.data?.jobId || null;
    } catch (e) {
        console.error(e);
        return null;
    }
}
