import React from "react";
import { observer } from "mobx-react";
import { Title } from "bloomer";

import CheckboxControl from "../controls/CheckboxControl";
import TextInputControl from "../controls/TextInputControl";

import projectStore from "stores/projectStore";
import settingsStore from "stores/settingsStore";


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

    const getValue = ( value: string, defaultValue?: boolean | string | string[] ): boolean | string | number | string[] => settingsStore.getSetting( "language", value, defaultValue );

    const { hasSyntaxHighlighting, compilerOptions } = projectStore.manager;
    const hasCompilerOptions = Boolean( compilerOptions );

    // if the language has no options, do nothing
    if( !hasSyntaxHighlighting && !hasCompilerOptions ) {
        return null;
    }

    return <section>
        <Title isSize={3}>
            {projectStore.manager.name} options
        </Title>

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
