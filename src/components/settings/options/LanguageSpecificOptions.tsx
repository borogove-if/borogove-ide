import React from "react";
import { observer } from "mobx-react";
import { Title } from "bloomer";

import CheckboxControl from "../controls/CheckboxControl";

import projectStore from "stores/projectStore";
import settingsStore from "stores/settingsStore";


/**
 * Options that are specific to certain systems
 */
const LanguageSpecificOptions: React.FC = observer( () => {
    const onChange = ( option: string ): ( newValue: boolean | string | number ) => void => ( newValue: boolean | string | number ): void => {
        settingsStore.saveSetting( "language", option, newValue );
    };

    const getValue = ( value: string, defaultValue?: boolean ): boolean | string | number => settingsStore.getSetting( "language", value, defaultValue );

    if( !projectStore.manager.hasSyntaxHighlighting ) {
        return null;
    }

    return <section>
        <Title isSize={3}>
            {projectStore.manager.name} options
        </Title>

        <CheckboxControl label="Syntax highlighting"
                         description="Add colors to syntactic elements of the code"
                         checked={getValue( "syntaxHighlighting", true ) as boolean}
                         onChange={onChange( "syntaxHighlighting" )} />
    </section>;
});

export default LanguageSpecificOptions;
