import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "types/enum";

const code = `#include "verblib.g"
#include "hugolib.h"

routine init
{
    TEXTCOLOR = DEF_FOREGROUND
    BGCOLOR = DEF_BACKGROUND
    SL_TEXTCOLOR = DEF_SL_FOREGROUND
    SL_BGCOLOR = DEF_SL_BACKGROUND

    counter = 0
    prompt = ">"
    color TEXTCOLOR, BGCOLOR

    DEFAULT_FONT = PROP_OFF
    Font(DEFAULT_FONT)

    cls

    "\\n\\nWelcome to Hugo!\\n\\n"

    Font(BOLD_ON)
    "Example Game"
    Font(BOLD_OFF)
    "A basic Hugo example"
    print BANNER

    player = you
    location = lab
    old_location = location

    move player to location
    FindLight(location)
    DescribePlace(location)
    location is visited
    CalculateHolding(player)
}

routine main
{
    counter++
    PrintStatusLine
    run location.each_turn
    runevents
    RunScripts
}

player_character you "you"
{}

room lab "Laboratory"
{
    long_desc
    {
       "You are in an example location."
    }    
    is light
}
`;

class HugoStandardLibraryProjectTemplate extends ProjectTemplate {
    id = "hugo";
    name = "Standard Hugo library";

    files = [
        {
            contents: code,
            id: "main",
            name: "main.hug",
            type: MaterialsFileType.code
        }
    ];

    remoteAssets = [
        process.env.REACT_APP_REMOTE_ASSETS_URL + "/templates/hugo/hugolib/" + process.env.REACT_APP_HUGO_LIBRARY_VERSION
    ];
}

export default new HugoStandardLibraryProjectTemplate();