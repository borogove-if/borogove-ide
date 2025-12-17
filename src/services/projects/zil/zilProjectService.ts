import { InterpreterIdentifier } from "services/interpreters/interpreterService";

import ProjectService from "../ProjectService.class";

import emptyZilProject from "./templates/emptyZilProject";
import smallZilProject from "./templates/smallZilProject";
import { compileZil } from "services/compilers/zilCompilerService";

/**
 * Initialize a zil project
 */
class ZilProjectService extends ProjectService {
    public compile = compileZil;
    public id = "zil";
    public interpreter: InterpreterIdentifier = "quixe";
    public language = "zil";
    public name = "ZIL";
    public storyFileFormat = "z";
    public templates = [emptyZilProject, smallZilProject];
}

export default new ZilProjectService();
