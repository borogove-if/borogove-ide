import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "stores/materialsStore";

const info = `title: My first story
author: Your name
`;

class EmptyDendryProjectTemplate extends ProjectTemplate {
    id = "dendry";
    name = "Empty project";
    isSnippetTemplate = false;
    files = [
        {
            contents: info,
            id: "info",
            name: "info.dry",
            type: MaterialsFileType.code
        }

    ];
}

export default new EmptyDendryProjectTemplate();
