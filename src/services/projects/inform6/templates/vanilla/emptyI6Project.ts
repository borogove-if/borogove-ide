import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "types/enum";

const code = `[ Main;
\t
];
`;

class EmptyI6ProjectTemplate extends ProjectTemplate {
    name = "No library";
    files = [
        {
            contents: code,
            id: "main",
            name: "main.inf",
            type: MaterialsFileType.code
        }
    ];
    initialCursorPosition = { lineNumber: 2, column: 4 };
}

export default new EmptyI6ProjectTemplate();