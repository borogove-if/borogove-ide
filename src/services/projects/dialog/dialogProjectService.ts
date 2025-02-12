import { InterpreterIdentifier } from "services/interpreters/interpreterService";
import { compileDialog } from "services/compilers/dialogCompilerService";

import emptyDialogProject from "./templates/emptyDialogProject";
import standardDialogProject from "./templates/standardDialogProject";

import ProjectService from "../ProjectService.class";

/**
 * Initialize a Dialog project
 */
class DialogProjectService extends ProjectService {
    public compile = compileDialog;
    public compilerOptions = {
        debug: ["-t", "aa", "-o", "story.aastory"],
        release: ["-t", "aa", "-o", "story.aastory"]
    };
    public id = "dialog";
    public interpreter: InterpreterIdentifier = "aamachine";
    public language = "dialog";
    public name = "Dialog";
    public orderedFiles = true;
    public storyFileFormat = "aamachine";
    public templates = [standardDialogProject, emptyDialogProject];

    /**
     * Convert the story file to base64 for the standalone web interpreter
     */
    public processReleaseFile = (
        name: string,
        content: Blob
    ): Promise<{ name: string; content: Blob }> => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(content);
            reader.onloadend = function (): void {
                const result = reader.result as string;

                // strip out the base64 header
                const headerEndsIn = ";base64,";
                const base64 = result.substr(
                    result.indexOf(headerEndsIn) + headerEndsIn.length
                );

                resolve({
                    name: "story.js",
                    content: new Blob([`window.aastory = '${base64}';`], {
                        type: "text/javascript"
                    })
                });
            };
        });
    };
}

export default new DialogProjectService();
