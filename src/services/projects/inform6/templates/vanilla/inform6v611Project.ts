import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "types/enum";

import code from "./i6code.txt";

/**
 * Inform 6 with library version 6.11. Many existing projects and especially
 * non-English language libraries still use 6.11.
 */
class Inform6v611Project extends ProjectTemplate {
    id = "inform6v611";
    name = "Library version 6.11";
    files = [
        {
            contents: code,
            id: "main",
            name: "main.inf",
            type: MaterialsFileType.code
        }
    ];
    remoteAssets = [
        process.env.REACT_APP_REMOTE_ASSETS_URL + "/templates/inform6/inform6lib/6.11"
    ];
}

export default new Inform6v611Project();
