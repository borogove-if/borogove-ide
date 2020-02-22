import { InterpreterIdentifier } from "services/interpreters/interpreterService";
import { compileDialog } from "services/compilers/dialogCompilerService";

// empty project disabled temporarily because the Å-machine interpreter doesn't run it correctly
// import emptyDialogProject from "./templates/emptyDialogProject";
import standardDialogProject from "./templates/standardDialogProject";

import ProjectService from "../ProjectService.class";


/**
 * Initialize a Dialog project
 */
class DialogProjectService extends ProjectService {
    public compile = compileDialog;
    public compilerOptions = {
        debug: [ "-t", "aa", "-o", "story.aastory" ],
        release: [ "-t", "aa", "-o", "story.aastory" ]
    };
    public id = "dialog";
    public interpreter: InterpreterIdentifier = "aamachine";
    public language = "dialog";
    public name = "Dialog";
    public templates = [ standardDialogProject /* , emptyDialogProject */ ];
}

export default new DialogProjectService();