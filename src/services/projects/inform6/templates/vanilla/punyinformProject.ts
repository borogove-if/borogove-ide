import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "stores/materialsStore";

import code from "./code/minimalPunyinform.txt";

/**
 * PunyInform project (https://github.com/johanberntsson/PunyInform)
 */
class PunyInformProject extends ProjectTemplate {
    id = "punyinform";
    name = "PunyInform " + process.env.REACT_APP_PUNYINFORM_VERSION;
    files = [
        {
            contents: code,
            id: "main",
            name: "main.inf",
            type: MaterialsFileType.code
        }
    ];
    remoteAssets = [
        process.env.REACT_APP_REMOTE_ASSETS_URL + "/templates/inform6/punyinform/" + process.env.REACT_APP_PUNYINFORM_VERSION
    ];
}

export default new PunyInformProject();
