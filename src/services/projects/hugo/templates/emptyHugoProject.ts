import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "types/enum";

const code = `routine main
{
\t
}
`;

class EmptyHugoProjectTemplate extends ProjectTemplate {
    id = "emptyHugo";
    name = "No library";
    files = [
        {
            contents: code,
            id: "main",
            name: "main.hug",
            type: MaterialsFileType.code
        }
    ];
    initialCursorPosition = { lineNumber: 3, column: 4 };
}

export default new EmptyHugoProjectTemplate();
