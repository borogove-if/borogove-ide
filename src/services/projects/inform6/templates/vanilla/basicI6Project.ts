import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "types/enum";

import code from "./i6code.txt";

class BasicI6ProjectTemplate extends ProjectTemplate {
    name = `Library version ${process.env.REACT_APP_INFORM6_LIBRARY_VERSION} (recommended)`;
    files = [
        {
            contents: code,
            id: "main",
            name: "main.inf",
            type: MaterialsFileType.code
        }
    ];
    remoteAssets = [
        process.env.REACT_APP_REMOTE_ASSETS_URL + "/templates/inform6/inform6lib/" + process.env.REACT_APP_INFORM6_LIBRARY_VERSION
    ];
}

export default new BasicI6ProjectTemplate();