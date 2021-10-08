import React, { SyntheticEvent } from "react";
import { MaterialsFileType } from "types/enum";

import compilationResultStore from "stores/compilationResultStore";
import materialsStore from "stores/materialsStore";
import projectStore from "stores/projectStore";

import { readFile } from "services/filesystem/localFilesystemService";
import { getInterpreterDomain } from "services/interpreters/interpreterService";

/**
 * Loads and runs an interpreter with the latest compiled story file.
 * The interpreter prop is the name of the interpreter to use.
 */
const Interpreter: React.FC = () => {
    const { storyfileLocalPath, storyfileRemoteUrl } = compilationResultStore;
    const interpreterDomain = getInterpreterDomain();

    // send story files and materials to the interpreter
    const sendFiles = function( e: SyntheticEvent<HTMLIFrameElement> ): void {
        const contentWindow = e.currentTarget.contentWindow;
        let storydata: string | null = null;

        if( storyfileLocalPath ) {
            storydata = projectStore.manager.hasBinaryStoryFiles
                ? compilationResultStore.getBase64Storyfile()
                : readFile( storyfileLocalPath, false ) as string;
        }

        // send the story file
        ( contentWindow as any ).postMessage({  // eslint-disable-line
            action: "start",
            storydata
        }, interpreterDomain );

        // send the materials
        materialsStore.files
            .filter( materialsFile => materialsFile.type !== MaterialsFileType.folder )
            .forEach( ( materialsFile: MaterialsFile ) => {
                if( materialsFile.type === MaterialsFileType.folder ) {
                    return;
                }

                const path = materialsStore.getPath( materialsFile ).substr( 1 );
                const content = readFile( materialsStore.getFilesystemPath( materialsFile ), projectStore.manager.hasBinaryStoryFiles );

                ( contentWindow as any ).postMessage({  // eslint-disable-line
                    action: "fileupload",
                    path,
                    content
                }, interpreterDomain );
            });
    };

    if( !storyfileLocalPath && !storyfileRemoteUrl ) {
        // neither remote URL nor a file in local filesystem was given,
        // can't do anything because we don't know what game to load
        // TODO error message?
        return null;
    }

    const fullUrl = projectStore.interpreterUrl( storyfileRemoteUrl );

    return <iframe src={fullUrl} id="interpreter-iframe" onLoad={sendFiles}></iframe>;
};

export default Interpreter;
