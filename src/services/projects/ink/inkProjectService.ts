import { InterpreterIdentifier } from "services/interpreters/interpreterService";
import { compileInk } from "services/compilers/inkCompilerService";

import ProjectService from "../ProjectService.class";

import emptyInkProject from "./templates/emptyInkProject";
import smallInkProject from "./templates/smallInkProject";
import largeInkProject from "./templates/largeInkProject";

/**
 * Initialize an Ink project
 */
class InkProjectService extends ProjectService {
    public compile = compileInk;
    public hasBinaryStoryFiles = false;
    public id = "ink";
    public interpreter: InterpreterIdentifier = "inkjs";
    public language = "ink";
    public name = "Ink";
    public storyFileFormat = "ink";
    public templates = [emptyInkProject, smallInkProject, largeInkProject];

    /**
     * Convert the compiled JSON story file to a JS file for web site release
     */
    public processReleaseFile = async (
        name: string,
        content: Blob
    ): Promise<{ name: string; content: Blob }> => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsText(content);
            reader.onloadend = function (): void {
                const json = reader.result as string;

                resolve({
                    name: "story.js",
                    content: new Blob([`window.storyContent = ${json};`], {
                        type: "text/javascript"
                    })
                });
            };
        });
    };
}

export default new InkProjectService();
