import React from "react";
import { observer } from "mobx-react";
import { Title } from "bloomer";

import CheckboxControl from "../controls/CheckboxControl";
import DropdownControl from "../controls/DropdownControl";
import TextInputControl from "../controls/TextInputControl";

import projectStore from "stores/projectStore";
import settingsStore from "stores/settingsStore";


// Temporary solution to get the new I7 compiler working – this shouldn't be tied to I7
import type { I7CompilerVersion } from "services/projects/inform7/inform7ProjectService";
export const DEFAULT_I7_COMPILER_VERSION = process.env.REACT_APP_DEFAULT_I7_COMPILER_VERSION as I7CompilerVersion;


/**
 * Options that are specific to certain systems
 */
const LanguageSpecificOptions: React.FC = observer( () => {
    const onChange = ( option: string ): ( newValue: boolean | string | number ) => void => ( newValue: boolean | string | number ): void => {
        settingsStore.saveSetting( "language", option, newValue );
    };

    const onChangeCompilerOptions = ( variant: CompilationVariant ): ( newValue: string ) => void => ( newValue: string ): void => {
        settingsStore.saveSetting( "language", variant + "CompilerOptions", newValue.split( "\n" ) );
    };

    const onChangeCompilerVersion = ( newValue: string ): void => {
        onChange( "compilerVersion" )( newValue );
        projectStore.compilerVersion = newValue;
    };

    const getValue = ( value: string, defaultValue?: boolean | string | string[] ): boolean | string | number | string[] => settingsStore.getSetting( "language", value, defaultValue );

    const { hasSyntaxHighlighting, compilerOptions, compilerVersions } = projectStore.manager;
    const hasCompilerOptions = Boolean( compilerOptions );
    const hasCompilerVersions = compilerVersions && compilerVersions.length > 1;

    // if the language has no options, do nothing
    if( !hasSyntaxHighlighting && !hasCompilerOptions && !hasCompilerVersions ) {
        return null;
    }

    return <section>
        <Title isSize={3}>
            {projectStore.manager.name} options
        </Title>

        {hasCompilerVersions && <DropdownControl label="Compiler version"
                                                 options={compilerVersions.map( version => ({ label: version, value: version }) )}
                                                 value={getValue( "compilerVersion", DEFAULT_I7_COMPILER_VERSION ) as string}
                                                 onChange={onChangeCompilerVersion} />}

        {hasSyntaxHighlighting && <CheckboxControl label="Syntax highlighting"
                                                   description="Add colors to syntactic elements of the code"
                                                   checked={getValue( "syntaxHighlighting", true ) as boolean}
                                                   onChange={onChange( "syntaxHighlighting" )} />}

        {hasCompilerOptions && <>
            <TextInputControl label="Compiler flags for debug version"
                              description="Command line options passed to the compiler in the editor preview. One option per line."
                              resetValue={projectStore.manager.compilerOptions?.debug.join( "\n" )}
                              value={( getValue( "debugCompilerOptions", projectStore.manager.compilerOptions?.debug ) as string[] ).join( "\n" )}
                              onChange={onChangeCompilerOptions( "debug" )}
                              multiline />

            <TextInputControl label="Compiler flags for release version"
                              description="Command line options passed to the compiler when building the release version. One option per line."
                              resetValue={projectStore.manager.compilerOptions?.release.join( "\n" )}
                              value={getValue( "releaseCompilerOptions", projectStore.manager.compilerOptions?.release.join( "\n" ) ) as string}
                              onChange={onChangeCompilerOptions( "release" )}
                              multiline />
        </>}
    </section>;
});

export default LanguageSpecificOptions;
