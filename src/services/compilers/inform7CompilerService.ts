import axios, { AxiosPromise, AxiosResponse } from "axios";

import compilationResultStore, { CompilationStage, RemoteCompilationResultResponse } from "stores/compilationResultStore";
import ideStateStore from "stores/ideStateStore";
import materialsStore from "stores/materialsStore";
import projectStore from "stores/projectStore";
import settingsStore from "stores/settingsStore";

import { logErrorMessage } from "services/app/loggers";
import { DEFAULT_I7_COMPILER_VERSION, I7CompilerVersion } from "services/projects/inform7/inform7ProjectService";

const API_URL = process.env.REACT_APP_I7_COMPILER_SERVICE_URL;

/**
 * Start the compilation process on the server. The server streams the compiler
 * output back, but we have no good way of returning results or catching compiler
 * errors, so this doesn't do anything else – we'll make another request for the
 * compilation results after this.
 */
function compile( compilerVersion: I7CompilerVersion, jobId: string, variant: CompilationVariant ): AxiosPromise | null {
    try {
        return axios({
            method: "get",
            url: `${API_URL}/compile/${compilerVersion}/${jobId}/${variant}`,
            onDownloadProgress: ( event: ProgressEvent ) => {
                // Typescript doesn't recognize the responseText member so we have to do this song and dance
                const target: unknown = event.currentTarget;
                const { responseText } = target as { responseText: string };

                // Analyze the result and set the compilation status based on what we get.
                if( compilationResultStore.stage === CompilationStage.firstPass ) {
                    const i7ProgressRegex = responseText.match( /\+\+ (\d{1,3})%[^+]*$/ );

                    if( i7ProgressRegex ) {
                        compilationResultStore.setPercentage( Number( i7ProgressRegex[ 1 ] ) );
                    }

                    if( responseText.indexOf( "++ Ended: Translation succeeded" ) > -1 ) {
                        compilationResultStore.setStage( CompilationStage.secondPass );
                    }
                }

                compilationResultStore.setCompilerOutput( responseText );
            }
        });
    }
    catch( e ) {
        return null;
    }
}


/**
 * The main function that starts the compilation process.
 */
export async function compileI7( variant: CompilationVariant ): Promise<boolean> {
    compilationResultStore.reset();
    compilationResultStore.setCompilationStatus( true );
    compilationResultStore.setStage( CompilationStage.uploading );

    // UUID/IFID is stored in uuid.txt, read it and check that it's a valid UUID
    try {
        const uuid = validateUUID();
        projectStore.setUUID( uuid );
    }
    catch( e ) {
        compilationResultStore.setRemoteResults({
            data: {
                success: false,
                report: `${( e as Error ).message}
                
UUID (aka IFID) is an identifier for the story file and it needs to be in a specific format, and for Inform 7 projects it needs to be set in a file called uuid.txt. The format of the identifier is xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12 characters) where each character is a number 0-9 or a letter A-F.

There was a problem reading the UUID from the file but you can create a new UUID with the button below and then retry compilation.`,
                action: "createUUID"    // offer the user a button that automatically creates a valid uuid.txt
            }
        });

        return false;
    }

    // Send files to the service
    const jobId = await prepare();

    if( !jobId ) {
        compilationResultStore.setRemoteResults({
            data: {
                success: false,
                report: "Could not connect to remote compilation service"
            }
        });

        return false;
    }

    compilationResultStore.setStage( CompilationStage.firstPass );

    // Tell the service to start the actual compilation job
    const compilationResults = await compile(
        settingsStore.getSetting( "language", "compilerVersion", DEFAULT_I7_COMPILER_VERSION ),
        jobId,
        variant
    );

    if( !compilationResults ) {
        compilationResultStore.setRemoteResults({
            data: {
                success: false,
                report: "Source text was successfully sent to the compiler service, but we couldn't get a response from the actual compilation stage. "
                    + "This could be a temporary network error on either your or our side of the connection."
            }
        });

        return false;
    }

    // Fetch and store the results
    const results = await getResults( jobId );

    if( !results || !results.data ) {
        compilationResultStore.setStage( CompilationStage.results );

        compilationResultStore.setRemoteResults({
            data: {
                success: false,
                report: "Source text was successfully sent to the compiler service and it reported that the compilation stage was completed, "
                    + "but the network request that should have fetched the compilation results failed. "
                    + "This could be a temporary network error on either your or our side of the connection."
            }
        });

        return false;
    }

    if( !results.data.data || typeof results.data.data.success !== "boolean" ) {
        const response = ( results.data && typeof results.data === "object" ) ? JSON.stringify( results.data, null, 2 ) : results.data;
        const wasReported = logErrorMessage( "Unexpected I7 compiler result: " + response );

        compilationResultStore.setRemoteResults({
            data: {
                success: false,
                report: "The project passed through the compilation stage successfully, but the compiler service returned something that we just weren't anticipating. "
                    + "As this is a completely unexpected situation, we don't have a solution to offer other than to try compiling again and hoping for the best.\n\n"
                    + ( wasReported
                        ? "An automated error message has been sent to the developers."
                        : "If the error continues to happen, we would appreciate a bug report sent with a form that can be found from the help menu." )
            }
        });

        return false;
    }

    compilationResultStore.setRemoteResults( results.data );

    return results.data.data.success;
}


/**
 * Gets the results of the compilation from the server.
 */
function getResults( jobId: string ): AxiosPromise<RemoteCompilationResultResponse> | null {
    try {
        return axios.get( `${API_URL}/results/${jobId}` );
    }
    catch( e ) {
        return null;
    }
}


/**
 * Prepare for compilation by sending source files to the compiler. The server
 * returns a job id we'll use for further requests.
 */
async function prepare(): Promise<string|null> {
    const source = materialsStore.findByFullPath( "/story.ni" );

    if( !source ) {
        throw new Error( "Source text file (story.ni) not found" );
    }

    try {
        const result: AxiosResponse<RemoteCompilationResultResponse> = await axios.post( API_URL + "/prepare", {
            data: {
                sessionId: ideStateStore.sessionId,
                language: "Inform 7",
                compilerVersion: "6M62",
                uuid: projectStore.uuid
            },
            included: [
                {
                    type: "file",
                    attributes: {
                        name: "story.ni",
                        directory: "Source",
                        contents: materialsStore.getContents( source )
                    }
                }
            ]
        });

        return result?.data?.data?.attributes?.jobId || null;
    }
    catch( e ) {
        return null;
    }
}


/**
 * Check that the UUID is correct
 */
function validateUUID(): string {
    const uuidFile = materialsStore.findByFullPath( "/uuid.txt" );

    if( !uuidFile ) {
        throw new Error( "Could not find an uuid.txt file." );
    }

    if( uuidFile.isBinary ) {
        throw new Error( "The uuid.txt file is in binary format." );
    }

    const uuid = materialsStore.getContents( uuidFile ).trim();

    if( !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test( uuid ) ) {
        throw new Error( "UUID is in incorrect format." );
    }

    return uuid;
}
