import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "types/enum";

const code = `"Serinette"
	
Include Vorple Multimedia by Juhana Leinonen.
Release along with the "Vorple" interpreter.

Release along with the file "winding.mp3".
Release along with the file "musicbox.mp3".
Release along with the file "serinette.jpg".

Drawing room is a room. "The drawing room is tastefully decorated."

The serinette is an openable closed container in the drawing room. "A beautiful music box sits on a table." The description is "There's a winding key behind the box."
Understand "music" and "box" as the serinette.

Before examining the serinette:
    place an image "serinette.jpg" with the description "A beautiful music box.", centered.

When play begins:
    preload image "serinette.jpg".

A winding key is part of the serinette.

The serinette can be wound or unwound. The serinette is unwound.

Winding is an action applying to one thing. Understand "wind [something]" as winding.

Check winding when the noun is not the serinette:
    say "That's not something you can wind." instead.

Check winding when the noun is wound:
    say "[The noun] is already wound." instead.

Carry out winding:
    if the serinette is open:
        say "(first closing the serinette)[command clarification break]";
        silently try closing the serinette;
    now the serinette is wound;
    play sound effect "winding.mp3".

Report winding:
    say "You turn the winding key until it turns no more.";

Instead of turning or winding the winding key:
    try winding the serinette.

Instead of inserting something into the serinette:
    say "It's not the kind of box that can contain anything other than its own mechanism."

Carry out opening the serinette when the serinette is wound:
    play music file "musicbox.mp3".

After opening the serinette:
    if the serinette is unwound:
        say "Nothing happens. Looks like it must be wound first.";
    otherwise:
        now the serinette is unwound;
        continue the action.

Carry out closing the serinette:
    stop the music.

Test me with "x serinette / wind serinette / open serinette".
`.split( "    " ).join( "\t" );

class SmallI7VorpleProjectTemplate extends ProjectTemplate {
    id = "vorpleSerinetteI7";
    name = "Serinette (small example)";
    isSnippetTemplate = false;

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

    remoteAssets = [ {
        url: process.env.REACT_APP_REMOTE_ASSETS_URL + "/templates/vorple/serinette",
        manifest: "manifest.i7.json"
    } ];

    manifestFile = "manifest.i7.json";
}

export default new SmallI7VorpleProjectTemplate();
