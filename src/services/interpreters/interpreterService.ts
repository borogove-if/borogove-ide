import ideStateStore from "stores/ideStateStore";
import snippetStore from "stores/snippetStore";

export type InterpreterIdentifier = "aamachine" | "hugojs" | "parchment" | "quixe" | "vorple";


/**
 * Returns the domain where interpreters can be found. An id is added as a security measure.
 */
export function getInterpreterDomain(): string {
    return ( process.env.REACT_APP_INTERPRETER_SERVICE_URL || "" ).split( "{id}" ).join( snippetStore.id || ideStateStore.sessionId );
}


/**
 * Builds an URL to the interpreter with optionally the story file address included.
 */
export function getInterpreterUrl( interpreter: InterpreterIdentifier, storyfileUrl?: string | null ): string {
    const interpreterServiceUrl = getInterpreterDomain();

    switch( interpreter ) {
        case "aamachine":
        {
            const storyParameter = storyfileUrl ? `?story=${storyfileUrl}` : "";
            return `${interpreterServiceUrl}/aamachine/${process.env.REACT_APP_AAMACHINE_VERSION}/index.html${storyParameter}`;
        }

        case "hugojs":
        {
            const storyParameter = storyfileUrl ? `?story=${storyfileUrl}` : "";
            return `${interpreterServiceUrl}/hugojs/${process.env.REACT_APP_HUGOJS_VERSION}/index.html${storyParameter}`;
        }

        case "parchment":
        {
            const storyParameter = storyfileUrl ? `&story=${storyfileUrl}` : "";
            return `${interpreterServiceUrl}/parchment/${process.env.REACT_APP_PARCHMENT_VERSION}/index.html?vm=zvm${storyParameter}`;
        }

        case "quixe":
        {
            const storyParameter = storyfileUrl ? `&story=${storyfileUrl}` : "";
            return `${interpreterServiceUrl}/parchment/${process.env.REACT_APP_PARCHMENT_VERSION}/index.html?vm=quixe${storyParameter}`;
        }

        case "vorple":
        {
            const storyParameter = storyfileUrl ? `?storyfile=${storyfileUrl}` : "";
            return `${interpreterServiceUrl}/vorple/${process.env.REACT_APP_VORPLE_VERSION}/${storyParameter}`;
        }

        default:
            throw new Error( "Unknown interpreter " + interpreter );
    }
}

/**
 * Builds information about the interpreter for creating a downloadable release package.
 * storyfileName is the name of the compiled story file included in the package,
 * and templateZipUrl is the location of the interpreter as a zip file.
 */
export function getStandaloneInterpreterMeta( interpreter: InterpreterIdentifier ): { storyfileName: string; templateZipUrl: string } {
    const interpreterServiceUrl = process.env.REACT_APP_REMOTE_ASSETS_URL + "/interpreters";

    switch( interpreter ) {
        case "aamachine":
        {
            return {
                storyfileName: "story.aastory",
                templateZipUrl: `${interpreterServiceUrl}/aamachine/${process.env.REACT_APP_AAMACHINE_VERSION}/release.zip`
            };
        }

        case "hugojs":
        {
            return {
                storyfileName: "story.hex",
                templateZipUrl: `${interpreterServiceUrl}/hugojs/${process.env.REACT_APP_HUGOJS_VERSION}/release.zip`
            };
        }

        case "parchment":
        {
            return {
                storyfileName: "story.z8",
                templateZipUrl: `${interpreterServiceUrl}/parchment/${process.env.REACT_APP_PARCHMENT_VERSION}/release.z8.zip`
            };
        }

        case "quixe":
        {
            return {
                storyfileName: "story.ulx",
                templateZipUrl: `${interpreterServiceUrl}/parchment/${process.env.REACT_APP_PARCHMENT_VERSION}/release.glulx.zip`
            };
        }

        case "vorple":
        {
            return {
                storyfileName: "story.ulx",
                templateZipUrl: `${interpreterServiceUrl}/vorple/${process.env.REACT_APP_VORPLE_VERSION}/release.zip`
            };
        }

        default:
            throw new Error( "Unknown interpreter " + interpreter );
    }
}
