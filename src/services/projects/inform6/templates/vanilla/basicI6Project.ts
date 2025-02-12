import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "stores/materialsStore";

import code from "./code/i6.txt";

class BasicI6ProjectTemplate extends ProjectTemplate {
    id = "inform6";
    name = "Standard Library";
    files = [
        {
            contents: code,
            id: "main",
            name: "main.inf",
            type: MaterialsFileType.code
        }
    ];
    remoteAssets = [
        process.env.REACT_APP_REMOTE_ASSETS_URL +
            "/templates/inform6/inform6lib/" +
            process.env.REACT_APP_INFORM6_LIBRARY_VERSION
    ];
}

export default new BasicI6ProjectTemplate();
