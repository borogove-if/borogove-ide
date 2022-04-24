import { InterpreterIdentifier } from "services/interpreters/interpreterService";

import Inform7ProjectService, { I7CompilerVersion } from "./inform7ProjectService";

import minimalI7VorpleProject from "./templates/vorple/minimalI7VorpleProject";
import smallI7VorpleProject from "./templates/vorple/smallI7VorpleProject";

/**
 * Inform 7 with Vorple
 */
class Inform7VorpleProjectService extends Inform7ProjectService {
    public id = "inform7-vorple";
    public compilerVersions: I7CompilerVersion[] = [ "6M62" ];
    public interpreter: InterpreterIdentifier = "vorple";
    public name = "Inform 7";
    public subtitle = "with Vorple";
    public templates = [ minimalI7VorpleProject, smallI7VorpleProject ];

    public filterReleaseFiles = ( files: MaterialsFile[] ): MaterialsFile[] => files.filter( ( file: MaterialsFile ) => {
        // don't include the source text
        if( file.name === "story.ni" && file.parent === null ) {
            return false;
        }

        // don't include the UUID file
        if( file.name === "uuid.txt" && file.parent === null ) {
            return false;
        }

        // include everything else
        return true;
    });
}

export default new Inform7VorpleProjectService();
