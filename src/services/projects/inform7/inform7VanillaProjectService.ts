import { InterpreterIdentifier } from "services/interpreters/interpreterService";

import Inform7ProjectService, { I7CompilerVersion } from "./inform7ProjectService";

import emptyI7Project from "./templates/vanilla/emptyI7Project";

/**
 * Initialize an Inform 7 project
 */
class Inform7VanillaProjectService extends Inform7ProjectService {
    public id = "inform7";
    public compilerVersions: I7CompilerVersion[] = [ "6M62", "6G60" ];
    public interpreter: InterpreterIdentifier = "quixe";
    public name = "Inform 7";
    public templates = [ emptyI7Project ];
    public fileManagerStartsOpen = false;
}

export default new Inform7VanillaProjectService();
