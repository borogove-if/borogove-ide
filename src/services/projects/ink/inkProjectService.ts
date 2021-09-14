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
    public id = "ink";
    public interpreter: InterpreterIdentifier = "inkjs";
    public language = "ink";
    public name = "Ink";
    public templates = [ emptyInkProject, smallInkProject, largeInkProject ];
}

export default new InkProjectService();
