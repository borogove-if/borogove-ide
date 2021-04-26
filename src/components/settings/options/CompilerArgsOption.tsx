import React from "react";
import { observer } from "mobx-react";
import TextareaSetting from "../controls/TextareaControl";
import settingsStore from "stores/settingsStore";

interface CompilerArgsOptionElementProps {
    onChange: ( event: React.FormEvent<HTMLInputElement> ) => void;
    options: string[];
}

export const CompilerArgsOptionElement: React.FC<CompilerArgsOptionElementProps> = ({ options, onChange }) => {
    const value = options.join( "\n" );

    return <div>
        <TextareaSetting value={value}
                         label="Compiler arguments"
                         description="These arguments will be passed to the compiler in addition to the arguments that specify the main source file and output file. One argument per line."
                         onChange={onChange} />
    </div>;
};

/**
 * Compiler arguments option
 */
const CompilerArgsOption: React.FC = observer( () => {
    const onChange = ( event: React.FormEvent<HTMLInputElement> ): void => {
        settingsStore.saveSetting( "compiler", "arguments", ( event.target as HTMLInputElement ).value.split( "\n" ) );
    };

    return <CompilerArgsOptionElement options={settingsStore.compilerOptions} onChange={onChange} />;
});

export default CompilerArgsOption;
