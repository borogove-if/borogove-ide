import { InterpreterIdentifier } from "services/interpreters/interpreterService";
import { compileHugo } from "services/compilers/hugoCompilerService";

import standardHugoProject from "./templates/standardHugoProject";
import emptyHugoProject from "./templates/emptyHugoProject";
import roodylibHugoProject from "./templates/roodylibHugoProject";

import ProjectService from "../ProjectService.class";


/**
 * Initialize a Hugo project
 */
class HugoProjectService extends ProjectService {
    public compile = compileHugo;
    public compilerOptions = {
        debug: [ "-s" ],
        release: [ "-s" ]
    };
    public id = "hugo";
    public includePaths = [
        "@source=/input"
    ];
    public interpreter: InterpreterIdentifier = "hugojs";
    public language = "hugo";
    public name = "Hugo";
    public storyFileFormat = "hugo";
    public templates = [ standardHugoProject, roodylibHugoProject, emptyHugoProject ];
}

export default new HugoProjectService();
