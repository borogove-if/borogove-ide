import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "types/enum";

const code = `"Untitled"

Laboratory is a room.
`;

class EmptyI7ProjectTemplate extends ProjectTemplate {
    id = "inform7";
    name = "Empty project";

    files = [
        {
            contents: code,
            displayName: "Source Text",
            id: "story",
            locked: true,
            name: "story.ni",
            type: MaterialsFileType.code
        }
    ];

    initialCursorPosition = { column: 1, lineNumber: 4 };
}

export default new EmptyI7ProjectTemplate();