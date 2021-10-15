import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "stores/materialsStore";

const code = `(program entry point)
\t
`;

class EmptyDialogProjectTemplate extends ProjectTemplate {
    id = "emptyDialog";
    name = "No library";
    files = [
        {
            contents: code,
            id: "main",
            name: "main.dg",
            type: MaterialsFileType.code
        }
    ];
    initialCursorPosition = { lineNumber: 2, column: 2 };
}

export default new EmptyDialogProjectTemplate();
