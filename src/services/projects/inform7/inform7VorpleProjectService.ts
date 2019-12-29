import { InterpreterIdentifier } from "services/interpreters/interpreterService";

import Inform7ProjectService from "./inform7ProjectService";

import minimalI7VorpleProject from "./templates/vorple/minimalI7VorpleProject";
import smallI7VorpleProject from "./templates/vorple/smallI7VorpleProject";

/**
 * Inform 7 with Vorple
 */
class Inform7VorpleProjectService extends Inform7ProjectService {
    public id = "inform7-vorple";
    public interpreter: InterpreterIdentifier = "vorple";
    public name = "Inform 7";
    public subtitle = "with Vorple";
    public templates = [ minimalI7VorpleProject, smallI7VorpleProject ];
}

export default new Inform7VorpleProjectService();