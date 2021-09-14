import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "types/enum";

const code = `"What's that?" my master asked.
*	"I am somewhat tired[."]," I repeated.
	"Really," he responded. "How deleterious."
*	"Nothing, Monsieur!"[] I replied.
	"Very good, then."
*  "I said, this journey is appalling[."] and I want no more of it."
	"Ah," he replied, not unkindly. "I see you are feeling frustrated. Tomorrow, things will improve."
`;

class SmallInkProjectTemplate extends ProjectTemplate {
    id = "smallExampleInk";
    name = "Small example";
    isSnippetTemplate = false;
    files = [
        {
            contents: code,
            id: "main",
            name: "main.ink",
            type: MaterialsFileType.code
        }
    ];
}

export default new SmallInkProjectTemplate();
