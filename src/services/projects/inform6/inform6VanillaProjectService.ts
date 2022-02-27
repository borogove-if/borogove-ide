import { InterpreterIdentifier } from "services/interpreters/interpreterService";

import basicI6Project from "./templates/vanilla/basicI6Project";
import emptyI6Project from "./templates/vanilla/emptyI6Project";
import minimalPunyinformProject from "./templates/punyinform/minimalPunyinformProject";
import smallPunyinformProject from "./templates/punyinform/smallPunyinformProject";

import Inform6ProjectService from "./Inform6ProjectService.class";

/**
 * Initialize an Inform 6 project
 */
class Inform6VanillaProjectService extends Inform6ProjectService {
    public compilerOptions = {
        debug: [ "-v8efsCuD" ],
        release: [ "-v8efsCu" ]
    };
    public id = "inform6";
    public interpreter: InterpreterIdentifier = "parchment";
    public name = "Inform 6";
    public templates = [ basicI6Project, minimalPunyinformProject, smallPunyinformProject, emptyI6Project  ];
}

export default new Inform6VanillaProjectService();
