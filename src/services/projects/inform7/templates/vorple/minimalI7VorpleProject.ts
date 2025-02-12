import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "stores/materialsStore";

const code = `"A Vorple Story"

Include Vorple Multimedia by Juhana Leinonen.
Include Vorple Notifications by Juhana Leinonen.

Lab is a room.

When play begins:
    place an image "vorple-logo.png" with the description "Vorple", centered;
	display a notification reading "Welcome to Vorple!".
`
    .split("    ")
    .join("\t");

class MinimalI7VorpleProjectTemplate extends ProjectTemplate {
    id = "vorpleI7";
    name = "Default Vorple project";

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

    remoteAssets = [
        {
            url:
                process.env.REACT_APP_REMOTE_ASSETS_URL +
                "/templates/vorple/minimal",
            manifest: "manifest.i7.json"
        }
    ];
}

export default new MinimalI7VorpleProjectTemplate();
