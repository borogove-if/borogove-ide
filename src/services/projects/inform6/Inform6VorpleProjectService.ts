import { InterpreterIdentifier } from "services/interpreters/interpreterService";

import materialsStore from "stores/materialsStore";

import minimalI6VorpleProject from "./templates/vorple/minimalI6VorpleProject";
import smallI6VorpleProject from "./templates/vorple/smallI6VorpleProject";

import Inform6ProjectService from "./Inform6ProjectService.class";

/**
 * Initialize an Inform 6 project with Vorple
 */
class Inform6VorpleProjectService extends Inform6ProjectService {
    public compilerOptions = {
        debug: [
            "-s~SefGCuD",
            "$MAX_LABELS=12000",
            "$MAX_STATIC_DATA=30000"
        ],
        release: [
            "-s~SefGCu",
            "$MAX_LABELS=12000",
            "$MAX_STATIC_DATA=30000"
        ]
    };
    public id = "inform6-vorple";
    public includePaths = [ "/input/library", "/input/vorple" ];
    public interpreter: InterpreterIdentifier = "vorple";
    public name = "Inform 6";
    public subtitle = "with Vorple";
    public templates = [ minimalI6VorpleProject, smallI6VorpleProject ];

    public filterReleaseFiles = ( files: MaterialsFile[] ): MaterialsFile[] => files.filter( ( file: MaterialsFile ) => {
        // include everything that's in the Materials folder
        return materialsStore.getPath( file ).indexOf( "/Materials/" ) === 0;
    });
}

export default new Inform6VorpleProjectService();
