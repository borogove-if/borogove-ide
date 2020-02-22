export type InterpreterIdentifier = "aamachine" | "hugojs" | "parchment" | "quixe" | "vorple";

/**
 * Builds an URL to the interpreter with optionally the story file address included.
 */
export function getInterpreterUrl( interpreter: InterpreterIdentifier, storyfileUrl?: string | null ): string {
    const interpreterServiceUrl = process.env.REACT_APP_REMOTE_ASSETS_URL + "/interpreters";

    switch( interpreter ) {
        case "aamachine":
        {
            const storyParameter = storyfileUrl ? `?story=${storyfileUrl}` : "";
            return `${interpreterServiceUrl}/aamachine/0.4.1/play.html${storyParameter}`;
        }

        case "hugojs":
        {
            const storyParameter = storyfileUrl ? `?story=${storyfileUrl}` : "";
            return `${interpreterServiceUrl}/hugojs/1.0.0/index.html${storyParameter}`;
        }

        case "parchment":
        {
            const storyParameter = storyfileUrl ? `&story=${storyfileUrl}` : "";
            return `${interpreterServiceUrl}/parchment/190916/index.html?vm=zvm${storyParameter}`;
        }

        case "quixe":
        {
            const storyParameter = storyfileUrl ? `?story=${storyfileUrl}` : "";
            return `${interpreterServiceUrl}/quixe/2.1.6/play.html${storyParameter}`;
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
                templateZipUrl: `${interpreterServiceUrl}/aamachine/0.3.1/release.zip`
            };
        }

        case "hugojs":
        {
            return {
                storyfileName: "story.hex",
                templateZipUrl: `${interpreterServiceUrl}/hugojs/1.0.0/release.zip`
            };
        }

        case "parchment":
        {
            return {
                storyfileName: "story.z8",
                templateZipUrl: `${interpreterServiceUrl}/parchment/190916/release.zip`
            };
        }

        case "quixe":
        {
            return {
                storyfileName: "story.ulx",
                templateZipUrl: `${interpreterServiceUrl}/quixe/2.1.6/release.zip`
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