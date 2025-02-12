const BrowserFS = require("browserfs"); // must be a require() call
import * as path from "path";

import compilationResultStore, {
    CompilationStage
} from "stores/compilationResultStore";
import materialsStore from "stores/materialsStore";
import projectStore from "stores/projectStore";
import settingsStore from "stores/settingsStore";

import {
    INPUT_TMP_PATH,
    OUTPUT_TMP_PATH
} from "services/filesystem/filesystemConstants";

import emscriptenLoader from "../remoteAssets/emscriptenLoaderService";
import { emscriptenLoaderCallback } from "./compilerHelpers";

function findStoryfile(): string | null {
    const FS = BrowserFS.BFSRequire("fs");
    const outputFiles = FS.readdirSync(OUTPUT_TMP_PATH);
    const storyfileExtensions = [".hex"];

    for (const file of outputFiles) {
        if (storyfileExtensions.indexOf(path.extname(file)) > -1) {
            return path.join(OUTPUT_TMP_PATH, file);
        }
    }

    return null;
}

export function compileHugo(variant: CompilationVariant): Promise<boolean> {
    compilationResultStore.reset();
    compilationResultStore.setCompilationStatus(true);
    compilationResultStore.setStage(CompilationStage.firstPass);
    let didQuit = false; // make sure quit() is called only once

    return new Promise(resolve => {
        const compilerOptions =
            settingsStore.getSetting(
                "language",
                variant + "CompilerOptions",
                projectStore.manager.compilerOptions?.[variant]
            ) || [];
        const entryFile = materialsStore.getPath(projectStore.entryFile);
        const includePaths = materialsStore.getIncludePaths(
            "@lib=" + INPUT_TMP_PATH
        );
        const compilerArguments = [
            ...compilerOptions,
            ...includePaths,
            path.join(INPUT_TMP_PATH, entryFile),
            "story.hex"
        ];

        compilationResultStore.addToCompilerOutput(
            "hc " + compilerArguments.join(" ") + "\n\n"
        );

        emscriptenLoader({
            // EXTRACTED FROM EMSCRIPTEN GENERATED JS FILE
            DYNAMIC_BASE: 5276064,
            DYNAMICTOP_PTR: 33152,
            wasmTableInitial: 16,
            wasmTableMaximum: 16,
            tmCurrent: 33008,
            tmTimezone: 33056,
            functionAlias: {
                environConstructor: "z",
                errnoLocation: "A",
                getDaylight: "B",
                getTimezone: "C",
                getTzname: "D",
                fflush: "E",
                free: "F",
                main: "G",
                malloc: "H",
                stackAlloc: "I",
                dynCallVi: null
            },
            /////////

            // used by the loader to choose correct internal addresses
            systemId: "hugo",

            arguments: compilerArguments,

            locateFile: (path: string) => {
                return `${process.env.REACT_APP_REMOTE_ASSETS_URL}/compilers/hugo/${process.env.REACT_APP_HUGO_COMPILER_VERSION}/${path}`;
            },
            onAbort: () => {
                // TODO: compiler crashed, must reload page!
                console.error("Emscripten aborted");
            },
            print: (text: string) => {
                console.log("- STDOUT:", text);
                compilationResultStore.addToCompilerOutput(text + "\n");
            },
            printErr: (text: string) => {
                console.log("* STDERR:", text);
            },
            quit: (errcode: number) => {
                if (didQuit) {
                    return;
                }

                didQuit = true;

                console.log("EMSCRIPTEN QUIT", errcode);
                const success: boolean = errcode === 0;

                compilationResultStore.setLocalResults({
                    storyfilePath: findStoryfile(),
                    success
                });

                // TODO: what if story file isn't found?

                resolve(success);
            }
        }).then(emscriptenLoaderCallback);
    });
}
