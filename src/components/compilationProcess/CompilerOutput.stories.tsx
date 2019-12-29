import React from "react";

import { storiesOf } from "@storybook/react";
import { CompilerOutputElement } from "./CompilerOutput";
import { action } from "@storybook/addon-actions";

const compilerOutputText = `Inform 7 build 6M62 has started.
++ 0% (Reading text)
I've now read your source text, which is 4100 words long.
++ 5% (Analysing sentences)
I've also read Standard Rules by Graham Nelson, which is 42655 words long.
I've also read English Language by Graham Nelson, which is 2297 words long.
I've also read Vorple by Juhana Leinonen, which is 5439 words long.
I've also read Vorple Command Prompt Control by Juhana Leinonen, which is 2086 words long.
I've also read Vorple Element Manipulation by Juhana Leinonen, which is 1738 words long.
I've also read Vorple Hyperlinks by Juhana Leinonen, which is 1814 words long.
I've also read Vorple Modal Windows by Juhana Leinonen, which is 700 words long.
I've also read Vorple Multimedia by Juhana Leinonen, which is 3906 words long.
I've also read Vorple Notifications by Juhana Leinonen, which is 1057 words long.
I've also read Vorple Screen Effects by Juhana Leinonen, which is 2385 words long.
I've also read Vorple Status Line by Juhana Leinonen, which is 2204 words long.
I've also read Vorple Tooltips by Juhana Leinonen, which is 1796 words long.
I've also read Basic Screen Effects by Emily Short, which is 2218 words long.
++ 15% (Drawing inferences)
++ 20% (Binding rulebooks)
++ 23% (Binding rulebooks)
++ 26% (Binding rulebooks)
++ 29% (Binding rulebooks)
++ 32% (Binding rulebooks)
++ 35% (Binding rulebooks)
++ 38% (Binding rulebooks)
++ 41% (Generating code)
++ 44% (Generating code)
++ 47% (Generating code)
++ 50% (Generating code)
++ 53% (Generating code)
++ 56% (Generating code)
++ 59% (Generating code)
++ 62% (Generating code)
++ 65% (Generating code)
++ 68% (Generating code)
++ 71% (Generating code)
++ 74% (Generating code)
++ 77% (Generating code)
++ 80% (Generating code)
++ 83% (Generating code)
++ 86% (Generating code)
++ 89% (Generating code)
++ 92% (Generating code)
++ 95% (Generating code)
++ 98% (Generating code)
I've also read Rideable Vehicles by Graham Nelson, which is 1819 words long.
I've also read Approximate Metric Units by Graham Nelson, which is 6289 words long.
I've also read Metric Units by Graham Nelson, which is 5340 words long.
I've also read Unicode Full Character Names by Graham Nelson, which is 118361 words long.
I've also read Unicode Character Names by Graham Nelson, which is 28382 words long.
I've also read Glulx Image Centering by Emily Short, which is 265 words long.
I've also read Menus by Emily Short, which is 2001 words long.
I've also read Complex Listing by Emily Short, which is 3410 words long.
I've also read Locksmith by Emily Short, which is 4122 words long.
I've also read Skeleton Keys by Emily Short, which is 638 words long.
I've also read Inanimate Listeners by Emily Short, which is 412 words long.
I've also read Punctuation Removal by Emily Short, which is 906 words long.
I've also read Basic Help Menu by Emily Short, which is 2368 words long.
I've also read Glulx Text Effects by Emily Short, which is 2182 words long.
I've also read Glulx Entry Points by Emily Short, which is 2682 words long.
I've also read Epistemology by Eric Eve, which is 1500 words long.

  The 4100-word source text has successfully been translated into an
    intermediate description which can be run through Inform 6 to complete
    compilation. There were 1 room and 1 thing.
++ 100% (Finishing work)
++ Ended: Translation succeeded: 1 room, 1 thing
Inform 7 has finished.
Inform 6.33N for Mac OS X (30th August 2015)
In:  1 source code files             79037 syntactic lines
 69145 textual lines               2596348 characters (ISO 8859-1 Latin1)
Allocated:
  9984 symbols (maximum 20000)    18337132 bytes of memory
Out:   Glulx story file 1.190907 (701K long):
    21 classes (maximum 200)            42 objects (maximum 512)
   231 global vars (maximum 512)     89613 variable/array space (maximum 180000)
    98 verbs (maximum 255)             371 dictionary entries (maximum 1300)
   182 grammar lines (version 2)       254 grammar tokens (unlimited)
   104 actions (maximum 200)            37 attributes (maximum 56)
    40 common props (maximum 256)       18 individual props (unlimited)
140791 characters used in text      110564 bytes compressed (rate 0.785)
     0 abbreviations (maximum 64)     3597 routines (unlimited)
 81316 instructions of code          47911 sequence points
112896 bytes writable memory used   604928 bytes read-only memory used
717824 bytes used in machine    1073024000 bytes free in machine
Compiled with 1851 suppressed warnings
Completed in 2 seconds`;

storiesOf( "CompilerOutput", module )
    .add( "I7 output", () => <CompilerOutputElement text={compilerOutputText} isOpen toggleOpen={action( "toggleOpen" )} /> )
    .add( "Closed", () => <CompilerOutputElement text={compilerOutputText} toggleOpen={action( "toggleOpen" )} /> );