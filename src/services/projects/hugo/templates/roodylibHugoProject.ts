import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "types/enum";

const code = {
    main: `!::
! Game Title
!::

!:: Raise limits, if necessary (here are some of the limits you're likely to
!   run into first).
!$MAXROUTINES = 320
!$MAXDICT = 1024
!$MAXDICTEXTEND = 0 ! (needed for adding more dictionary words mid-game)

constant GAME_TITLE "GAME TITLE"
constant AUTHOR "YOUR NAME"
constant RELEASE "1.0"
!constant BLURB "An Interactive Blah"
!constant IFID "put-IFID here"

!:: Flags
#include "flags.hug"   ! edit "flags.hug to fit your game

#ifset HDX
#switches -d              ! if the -d switch is not set in the compiler itself,
                          ! #set HDX will produce a Hugo Debuggable Executable
                          ! (.HDX) with extension .HEX
#endif                    ! Sneaky!

!:: Grammar Library Inclusions (grammar must come first)
#include "grammar.g"

!:: Other constants and global variables
!  (some constants must be set before hugolib is included):

!constant AFTER_PERIOD " "     ! include one space after full stops (as opposed
                               !   to two)
!constant INDENT_SIZE 0        ! no indentation in room descriptions and room
                               !   content listings

! "Roody Inclusions"
#include "roodyinc.h"


!::	Game Initialization	routine
routine init
{
!: First Things First
	SetGlobalsAndFillArrays
!: Screen clear section
#ifclear _ROODYLIB_H
	CenterTitle("Hugo Interactive Fiction")
	cls
#ifset USE_PLURAL_OBJECTS
	InitPluralObjects
#endif
#else
	SimpleIntro
	InitScreen
!: Set up any special libries
	Init_Calls
#endif
!: Game opening
	IntroText
	MovePlayer(location)
}


routine SetGlobalsAndFillArrays
{
!\\ Uncomment and modify this section if your game has scoring and ranking.
	MAX_SCORE = 50
	ranking[0] = "Amateur Adventurer"
	ranking[1] = "Competent Door-Unlocker"
	ranking[2] = "Bomb-Meddling Adventurer"
	ranking[3] = "Master Magic Wand Finder"
	ranking[4] = "The Genuine Article Sample Game Solver"
	MAX_RANK = 4  \\!
! if using Roodylib, verbosity can be set to BRIEF, SUPERBRIEF, OR VERBOSE
	verbosity = 2
	counter = -1                    ! 1 turn before turn 0
! statustype options: 0 = no status, 1 = score/turns, 2 = time
! if using Roodylib, can be set to NO_STATUS, SCORE_MOVES, TIME_STATUS,
! CUSTOM_STATUS, INFOCOM_STYLE, MILITARY_TIME
	STATUSTYPE = 1
	TEXTCOLOR = DEF_FOREGROUND         ! These are the default values of these
	BGCOLOR = DEF_BACKGROUND           ! variables. This is mainly here as a
	SL_TEXTCOLOR = DEF_SL_FOREGROUND   ! reminder you can change the values here
	SL_BGCOLOR = DEF_SL_BACKGROUND     ! if you'd like.
#if defined TITLECOLOR
	TITLECOLOR = DEF_FOREGROUND
#endif
#if defined GAME_TITLE
	display.title_caption = GAME_TITLE
#endif
	prompt = ">"
	DEFAULT_FONT = PROP_ON
#ifset _ROODYLIB_H
	MakePlayer(you,2) ! sets player as you object, second person
#else
	player = you
#endif
	location = STARTLOCATION
}

routine IntroText
{
	"Intro text goes here."
#if defined DoVersion
	""
	DoVersion
#endif
}

!::	Main game loop
routine main
{
	counter = counter + 1
	run location.each_turn
	runevents
	RunScripts
#ifset _ROODYLIB_H
	SpeakerCheck
#else
	if parent(speaking) ~= location
		speaking = 0
#endif
	PrintStatusLine
#ifset _ROODYLIB_H
	Main_Calls
#endif
}


player_character you "you"
{
}

room STARTLOCATION "Start Location"
{
}
`,
    flags: `!----------------------------------------------------------------------------
    !* New flags
    !----------------------------------------------------------------------------
    !#set HUGOFIX             ! Compile with HugoFix Debugging Library
                              !    commands available   (type $? in game)
    #set VERSIONS            ! Have compiler list library versions
    
    !----------------------------------------------------------------------------
    !*Hugolib inclusions
    !----------------------------------------------------------------------------
    !#set RESOURCES           ! include resource.h
    !#set SYSTEM              ! include system.h
    !#set VERBSTUBS           ! Include the grammar and routines from
                              !    verbstubs.g and verbstubs.h, respectively
    !#set WINDOWS             ! include window.h
    
    !----------------------------------------------------------------------------
    !* Library contribution inclusions
    !----------------------------------------------------------------------------
    #set USE_ROODYLIB        ! Compile with Roodylib
    !#set PASTTENSE           ! Compile with "pasttense.h"
    
    !----------------------------------------------------------------------------
    !* Configuration file inclusions
    !----------------------------------------------------------------------------
    
    !#set USE_COVERART        ! Use the "fake cover art" extension.
    !#set USE_COLORLIB        ! Compile with colorlib, a library for
                              !  font-color-intensive games
    
    !----------------------------------------------------------------------------
    !*Hugolib flags
    !----------------------------------------------------------------------------
    !#set HDX                 ! Compile as Hugo Debuggable Executable (see
                              !    below for details)
    !#set USE_ATTACHABLES     ! Use attachable items
    !#set USE_CHECKHELD       ! Use checkheld system (held-requiring actions
                              ! automatically pick up unheld objects)
    !#set USE_PLURAL_OBJECTS  ! Use plural objects
    !#set USE_VEHICLES        ! Use vehicle objects
    
    ! Note: the OLD_STYLE_PRONOUNS flag is currently forced by hugolib
    
    #ifset HUGOFIX
    #set DEBUG
    #endif
    
    !----------------------------------------------------------------------------
    !* Hugolib "NO_*" flags (flags for turning stuff off)
    ! [ NOTE: Some of these may not work with Roodylib ]
    !----------------------------------------------------------------------------
    !#set NO_AUX_MATH         ! No advanced math needed
    !#set NO_FONTS            ! Don't use font effects
    !#set NO_FUSES            ! Don't use fuses
    !#set NO_MENUS            ! Don't use menus
    !#set NO_OBJLIB           ! Don't use objlib
    !#set NO_RECORDING        ! Don't allow transcripts
    !#set NO_SCRIPTS          ! Don't use character scripts
    !#set NO_STRING_ARRAYS    ! Don't use string arrays
    !#set NO_UNDO             ! Make UNDO completely unimplemented
    !#set NO_VERBS            ! Don't use any standard verbs
    !#set NO_XVERBS           ! Don't use any standard "out-of-world" verbs
    
    !----------------------------------------------------------------------------
    !* Roodylib flags
    !----------------------------------------------------------------------------
    
    #ifset USE_ROODYLIB
    !#set AIF                      ! allow >REMOVE ALL and >WEAR ALL ("aif" is a
                                   ! joke, I swear!)
    !#set AMERICAN_ENGLISH         ! Use American English quotation mark rules
    !#set AUTOMATIC_EXAMINE        ! un-examined items are examined when picked up
    !#set BETA                     ! Compile with the comments-in-transcripts
                                   ! library addition
    !#set FORCE_DEFAULT_MESSAGE    ! Containers with no long_desc get old descs
    !#set LIST_CLOTHES_FIRST       ! List worn items first in inventories and
                                   ! examining characters (see documentation)
    !#set MULTI_PCS                ! Support for games where you play different
                                   ! player characters visiting the same rooms
    !#set NEW_DESC                 ! like short_desc but doesn't demand a new line
                                   ! after being printed (experimental)
    !#set NEW_EMPTY                ! Use more robust DoEmpty behavior (see roodylib)
    !#set NEW_FUSE                 ! Experimental new fuse definition
    !#set NEW_ROOMS                ! Undoing after the first turn in a room shows
                                   ! the initial_desc, not the long_desc
    !#set NEW_STYLE_PRONOUNS       ! Use New Style Pronouns (see roodylib comments)
    !#set NO_ACCESSIBILITY         ! Disallow accessibility mode options
    !#set NO_AUTOMATIC_DOOR_UNLOCK ! Don't allow automatic door-unlocking
    !#set NO_DISAMB_HELP           ! Don't use parser disambiguation helper
    !#set NO_FANCY_STUFF           ! Don't use word-array game-state saving or
                                   ! new preparse system, or new PrintStatusLine
    !#set NO_LOOK_TURNS            ! commands like "look" and "examine" don't take
                                   ! up a turn
    !#set NO_MODE_CHANGE           ! Disallow >BRIEF, SUPERBRIEF, and VERBOSE
    !#set NO_SORTING               ! Don't use array and property sorting routines
    !#set NO_VERSION               ! Don't use Roodylib's DoVersion routine
    !#set NO_XYZZY                 ! Don't use >XYZZY response code
    !#set OBJECT_SORTING           ! Use object-sorting system
    !#set ROTATE_DESC              ! Use description-rotating routines
    !#set NEW_ROTATE               ! Use alternate description rotation routine, ha
    !#set ROUTINE_GRAMMAR_HELPER   ! Use Routine Grammar Helper (see comments)
    !#set SCORE_NOTIFY             ! Use score change notification code
    !#set SHOW_COMMANDS            ! UNDOs and multiple command lines will show
                                   ! the turn being processed
    !#set SKIP_DOORS               ! Player can walk through closed, unlocked doors
                                   !  without opening them, just like NPCs
    !#set SMART_PARENT_DIRECTIONS  ! Trying to go in an invalid direction while
                                   !  in an enterable object gives "You can't go
                                   !  that way." instead of "You'll have to get
                                   !  up/out."
    !#set USE_AFTER_UNDO           ! Use after_undo array to call routines
                                   !  after successful UNDOs
    !#set USE_BOXDRAW              ! Use quote box code
    !#set USE_CONFIG_SYSTEM        ! Use configuration-file-writing helper code
    !#set USE_DARK_ROOM            ! Dark rooms appear more room-like when entered
    !#set USE_ELEVATED_PLATFORMS   ! Allows enterable platforms for which >DOWN
                                   !  exits (like a ladder or bleachers)
    !#set USE_EXTENSION_CREDITING  ! Use routines for listing all included
                                   ! libraries
    !#set USE_FOOTNOTES            ! Use footnote code
    !#set HITCHHIKER_STYLE         ! All footnotes available all the time
    !#set USE_JUKEBOX              ! Use Roodylib music player manager
    !#set USE_NEWMENU              ! Use Roodylib's menu system replacement
    !#set USE_RELATIVE_DESCRIPTIONS ! Default room descriptions are different
                                   ! if the player is in an enterable container
    !#set USE_ROLLABLES            ! Include Roodylib's object-rolling code
    !#set USE_SCOPE_REACT          ! Check react_before/react_after of scope objects
    !#set USE_STRING_MANIPULATION  ! Include string manipulation routines
    !#set USE_SUPERCONTAINER       ! Use supercontainer object class
    !#set USE_TIME_SYSTEM          ! Enable time-tracking routines
    #endif ! ifset USE_ROODYLIB
`,
    grammar: `!::
    !   Grammar
    !::
    ! You can define game-specific grammar here, it you'd like
    
    
    
    
    
    
    
    
    
    
    
    #ifset USE_ROODYLIB
    #include "roodylib.g"
    #endif
    
    #ifset USE_COVERART
    #include "coverartlib.g"
    #endif
    
    #ifset USE_COLORLIB
    #include "colorlib.g"
    #endif
    
    #include "verblib.g" ! will include verbstub.g and hugofix.g, if applicable
`,
    roodyinc: `!::
    ! Roody Inclusions
    !::
    
    !\\#ifset VERSIONS
    #message "[NAME].h Version #"
    #endif \\!
    
    
    #include "hugolib.h"
    
    #ifset RESOURCES
    #include "resource.h"
    #endif
    
    #ifset SYSTEM
    #include "system.h"
    #endif
    
    #ifset WINDOWS
    #include "window.h"
    #endif
    
    #ifset USE_ROODYLIB
    #include "roodylib.h"
    #endif
    
    #ifset PASTTENSE
    #include "pasttense.h"
    #endif
    
    #ifset USE_COVERART
    #include "coverartlib.h"
    #endif
    
    #ifset USE_COLORLIB
    #include "colorlib.h"
    #endif
    
    #ifset DEBUG
    replace last_library_object
    {}
    #endif
`
};

class RoodyLibHugoProjectTemplate extends ProjectTemplate {
    name = "Roodylib shell";

    files = [
        {
            contents: code.main,
            id: "main",
            name: "main.hug",
            type: MaterialsFileType.code
        },
        {
            contents: code.flags,
            id: "flags",
            name: "flags.hug",
            type: MaterialsFileType.code
        },
        {
            contents: code.grammar,
            id: "grammar",
            name: "grammar.g",
            type: MaterialsFileType.code
        },
        {
            contents: code.roodyinc,
            id: "roodyinc",
            name: "roodyinc.h",
            type: MaterialsFileType.code
        }
    ];

    remoteAssets = [
        process.env.REACT_APP_REMOTE_ASSETS_URL + "/templates/hugo/hugolib/" + process.env.REACT_APP_HUGO_LIBRARY_VERSION,
        process.env.REACT_APP_REMOTE_ASSETS_URL + "/templates/hugo/roodylib/" + process.env.REACT_APP_ROODYLIB_VERSION
    ];
}

export default new RoodyLibHugoProjectTemplate();