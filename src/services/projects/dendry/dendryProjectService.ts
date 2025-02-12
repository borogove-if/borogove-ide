import { InterpreterIdentifier } from "services/interpreters/interpreterService";
import { compileDendry } from "services/compilers/dendryCompilerService";

import ProjectService from "../ProjectService.class";

import emptyDendryProject from "./templates/emptyDendryProject";
import smallDendryProject from "./templates/smallDendryProject";

/**
 * Initialize a dendry project
 */
class DendryProjectService extends ProjectService {
    public compile = compileDendry;
    public hasBinaryStoryFiles = false;
    public id = "dendry";
    public interpreter: InterpreterIdentifier = "dendry";
    public language = "dendry";
    public name = "Dendry";
    public storyFileFormat = "dry";
    public templates = [emptyDendryProject, smallDendryProject];

    public processReleaseFile = async (
        name: string,
        content: Blob
    ): Promise<{ name: string; content: Blob }> => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsText(content);
            reader.onloadend = function (): void {
                const javascript_story = reader.result as string;

                resolve({
                    name: "core.js",
                    content: new Blob([`window.game = ${javascript_story};`], {
                        type: "text/javascript"
                    })
                });
            };
        });
    };
}

export default new DendryProjectService();
