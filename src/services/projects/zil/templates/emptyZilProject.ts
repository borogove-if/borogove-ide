import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "stores/materialsStore";

const contents = `"EMPTY GAME main file"

<VERSION ZIP>
<CONSTANT RELEASEID 1>

"Main loop"

<CONSTANT GAME-BANNER
"EMPTY GAME|
An interactive fiction by AUTHOR NAME">

<ROUTINE GO ()
    <CRLF> <CRLF>
    <TELL "INTRODUCTORY TEXT!" CR CR>
    <V-VERSION> <CRLF>
    <SETG HERE ,STARTROOM>
    <MOVE ,PLAYER ,HERE>
    <V-LOOK>
    <MAIN-LOOP>>

<INSERT-FILE "parser">

"Objects"

<OBJECT STARTROOM
    (IN ROOMS)
    (DESC "START ROOM")
    (FLAGS LIGHTBIT)>`;

class EmptyZilProjectTemplate extends ProjectTemplate {
    id = "zil";
    name = "Empty project";
    isSnippetTemplate = false;
    files = [
        {
            contents,
            id: "main",
            name: "main.zil",
            type: MaterialsFileType.code
        }
    ];
}

export default new EmptyZilProjectTemplate();
