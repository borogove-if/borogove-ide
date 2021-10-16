import { compileI6 } from "services/compilers/inform6CompilerService";

import ProjectService from "../ProjectService.class";

/**
 * Initialize an Inform 6 project
 */
export default abstract class Inform6ProjectService extends ProjectService {
    public compile = compileI6;
    public includePaths = [ "/input/library" ];
    public language = "inform6";
    public name = "Inform 6";
    public storyFileFormat = "z";
}
