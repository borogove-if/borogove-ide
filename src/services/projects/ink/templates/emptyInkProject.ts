import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "stores/materialsStore";

class EmptyInkProjectTemplate extends ProjectTemplate {
    id = "ink";
    name = "Empty project";
    files = [
        {
            contents: "",
            id: "main",
            name: "main.ink",
            type: MaterialsFileType.code
        }
    ];
}

export default new EmptyInkProjectTemplate();
