export type InterpreterIdentifier = "hugojs" | "parchment" | "quixe" | "vorple";

export function getInterpreterUrl( interpreter: InterpreterIdentifier, storyfileUrl?: string | null ): string {
    const interpreterServiceUrl = process.env.REACT_APP_REMOTE_ASSETS_URL + "/interpreters";

    switch( interpreter ) {
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

export function getStandaloneInterpreterMeta( interpreter: InterpreterIdentifier ): { storyfileName: string; templateZipUrl: string } {
    const interpreterServiceUrl = process.env.REACT_APP_REMOTE_ASSETS_URL + "/interpreters";

    switch( interpreter ) {
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