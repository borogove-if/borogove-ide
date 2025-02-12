import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "stores/materialsStore";

const code = `(intro)
\tWelcome to Dialog!
\t(try [look])

(current player #player)
(#player is #in #room)

#room
(room *)
(name *)	Room
(look *)
\t\tThis is the starting location.
`;

class DialogStandardLibraryProjectTemplate extends ProjectTemplate {
    id = "dialog";
    name = "Standard Dialog library";

    files = [
        {
            contents: code,
            id: "story",
            name: "story.dg",
            type: MaterialsFileType.code
        }
    ];

    remoteAssets = [
        process.env.REACT_APP_REMOTE_ASSETS_URL +
            "/templates/dialog/stdlib/" +
            process.env.REACT_APP_DIALOG_LIBRARY_VERSION
    ];
}

export default new DialogStandardLibraryProjectTemplate();
