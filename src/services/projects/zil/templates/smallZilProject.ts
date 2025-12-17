import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "stores/materialsStore";

const contents = `"Cloak of Darkness main file"

<VERSION ZIP>
<CONSTANT RELEASEID 1>

"Main loop"

<CONSTANT GAME-BANNER
"Cloak of Darkness|
A basic IF demonstration.|
Original game by Roger Firth|
ZIL conversion by Tara McGrew, Jayson Smith, and Josh Lawrence">

<ROUTINE GO ()
    <CRLF> <CRLF>
    <TELL "Hurrying through the rainswept November night, you're glad to see the
bright lights of the Opera House. It's surprising that there aren't more
people about but, hey, what do you expect in a cheap demo game...?" CR CR>
    <INIT-STATUS-LINE>
    <V-VERSION> <CRLF>
    <SETG HERE ,FOYER>
    <MOVE ,PLAYER ,HERE>
    <V-LOOK>
    <MAIN-LOOP>>

<INSERT-FILE "parser">

"Objects"

<OBJECT CLOAK
    (DESC "cloak")
    (SYNONYM CLOAK)
    (IN PLAYER)
    (FLAGS TAKEBIT WEARBIT WORNBIT)
    (ACTION CLOAK-R)>

<ROUTINE CLOAK-R ()
    <COND (<VERB? EXAMINE> <TELL "The cloak is unnaturally dark." CR>)>>

<ROOM FOYER
    (DESC "Foyer of the Opera House")
    (IN ROOMS)
    (LDESC "You are standing in a spacious hall, splendidly decorated in red
and gold, with glittering chandeliers overhead. The entrance from
the street is to the north, and there are doorways south and west.")
    (SOUTH TO BAR)
    (WEST TO CLOAKROOM)
    (NORTH SORRY "You've only just arrived, and besides, the weather outside
seems to be getting worse.")
    (FLAGS LIGHTBIT)>

<ROOM BAR
    (DESC "Foyer Bar")
    (IN ROOMS)
    (LDESC "The bar, much rougher than you'd have guessed after the opulence
of the foyer to the north, is completely empty.")
    (NORTH TO FOYER)
    (ACTION BAR-R)>

<GLOBAL DISTURBED 0>

<ROUTINE BAR-R (RARG)
    <COND
        (<==? .RARG ,M-ENTER>
            <COND (<FSET? ,CLOAK ,WORNBIT> <FCLEAR ,BAR ,LIGHTBIT>)
                (ELSE <FSET ,BAR ,LIGHTBIT>)>)
        (<==? .RARG ,M-BEG>
            <COND (<AND <NOT <FSET? ,BAR ,LIGHTBIT>>
                        <NOT <GAME-VERB?>>
                        <NOT <VERB? LOOK>>
                        <NOT <AND <VERB? WALK> <==? ,PRSO ,P?NORTH>>>>
                            <TELL "You grope around clumsily in the dark. Better be careful." CR>
                            <SETG DISTURBED <+ ,DISTURBED 1>>)>)>>

<OBJECT MESSAGE
    (DESC "message")
    (SYNONYM MESSAGE FLOOR SAWDUST DUST)
    (ADJECTIVE SCRAWLED)
    (IN BAR)
    (FDESC "There seems to be some sort of message scrawled in the sawdust on the floor.")
    (ACTION MESSAGE-R)>

<ROUTINE MESSAGE-R ()
    <COND (<VERB? EXAMINE READ>
            <TELL "The message simply reads: \\"You ">
            <COND (<G? ,DISTURBED 1> <TELL "lose.">)
                (ELSE <TELL "win.">)>
            <TELL "\\"" CR>
            <V-QUIT>)>>

<ROOM CLOAKROOM
    (DESC "Cloakroom")
    (IN ROOMS)
    (LDESC "The walls of this small room were clearly once lined with hooks,
though now only one remains. The exit is a door to the east.")
    (EAST TO FOYER)
    (FLAGS LIGHTBIT)>

<OBJECT HOOK
    (DESC "small brass hook")
    (IN CLOAKROOM)
    (SYNONYM HOOK PEG)
    (ADJECTIVE SMALL BRASS)
    (FDESC "A small brass hook is on the wall.")
    (FLAGS CONTBIT SURFACEBIT)>`;

class smallZilProjectTemplate extends ProjectTemplate {
    id = "zil";
    name = "Small example project";
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

export default new smallZilProjectTemplate();
