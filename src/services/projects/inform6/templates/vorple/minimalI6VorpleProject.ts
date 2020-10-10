import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "types/enum";

const code = `Constant Story "My story^";
Include "vorple.h";
Include "Parser";
Include "VerbLib";

! Include Vorple libraries here
Include "vorple-notifications.h";
Include "vorple-multimedia.h";

Include "Grammar.h";

[ Initialise ;
    location = room;
    VorpleInitialise();

    ! Show a notification that fades out automatically after a few seconds
    VorpleNotification("Welcome to Vorple!");

    ! Display a picture
    VorpleImage("vorple-logo.png");
];

Object room "The Room"
    with description "You're in a nondescript room.",
has light;
`;

class MinimalI6VorpleProject extends ProjectTemplate {
    id = "vorpleI6";
    name = "Minimal Vorple project";

    files = [
        {
            contents: code,
            id: "main",
            name: "main.inf",
            type: MaterialsFileType.code
        }
    ];
    remoteAssets = [
        process.env.REACT_APP_REMOTE_ASSETS_URL + "/templates/inform6/inform6lib/" + process.env.REACT_APP_INFORM6_LIBRARY_VERSION,
        process.env.REACT_APP_REMOTE_ASSETS_URL + "/templates/inform6/vorple/" + process.env.REACT_APP_VORPLE_VERSION,
        {
            url: process.env.REACT_APP_REMOTE_ASSETS_URL + "/templates/vorple/minimal",
            manifest: "manifest.i6.json"
        }
    ];
}

export default new MinimalI6VorpleProject();