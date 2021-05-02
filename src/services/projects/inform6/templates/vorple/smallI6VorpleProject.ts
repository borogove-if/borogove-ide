import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "types/enum";

const code = `! Serinette - Basic example of playing music and sound effects.
! The serinette (a type of music box) plays music when it opens and a sound effect when it's wound. We'll also show its picture when it's examined.

Constant Story "Serinette^";

Include "vorple.h";
Include "Parser";
Include "VerbLib";
Include "vorple-multimedia.h";
Include "Grammar";

[ Initialise ;
	location = drawingroom;
	VorpleInitialise();
	VorplePreloadImage("serinette.jpg");
];

Attribute wound;

Object drawingroom "Drawing room"
	with description "The drawing room is tastefully decorated.",
has light;

[ PlayTune ;
	VorplePlayMusic("musicbox.mp3");
	give serinette ~wound;
];

Object serinette "serinette" drawingroom
 	with description [; VorpleImage("serinette.jpg", "A beautiful music box.", IMAGE_CENTERED); "There's a winding key behind the box."; ],
	describe "A beautiful music box sits on a table.",
	name 'serinette' 'music' 'box',
	before [; Wind: if (self has open) {print "(first closing the serinette)^"; VorpleStopMusic(); give self ~open;} give self wound; VorplePlaySoundEffect("winding.mp3"); "You turn the winding key until it turns no more.";
		Receive: "It's not the kind of box that can contain anything other than its own mechanism.";
		Open: if (self has wound) {PlayTune(); } else {"Nothing happens. Looks like it must be wound first.";}
		Close: VorpleStopMusic();
		],
has openable container transparent;

Object windingkey "winding key" serinette
	with name 'winding' 'key',
	before [; Wind: <<Wind serinette>>;
	];

[ WindSub;
	if (noun has wound) {print (The) noun, " is already wound.";}
	else {"That's not something you can wind";}
];

Verb 'wind'
* noun		->Wind;
`;

class SmallI6VorpleProject extends ProjectTemplate {
    id = "serinetteVorpleI6";
    name = "Serinette (small example)";
    isSnippetTemplate = false;

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
            url: process.env.REACT_APP_REMOTE_ASSETS_URL + "/templates/vorple/serinette",
            manifest: "manifest.i6.json"
        }
    ];

    manifestFile = "manifest.i6.json";
}

export default new SmallI6VorpleProject();
