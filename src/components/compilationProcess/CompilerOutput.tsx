import React, { useState } from "react";
import { observer } from "mobx-react";
import compilationResultStore from "stores/compilationResultStore";
import "./CompilerOutput.scss";
import { Button } from "bloomer";

interface CompilerOutputElementProps {
    isOpen?: boolean;
    text: string;
    toggleOpen: () => void;
}

export const CompilerOutputElement: React.FC<CompilerOutputElementProps> = ({ isOpen = false, text, toggleOpen }) => <div id="compiler-output">
    <div id="compiler-output-toggle">
        <Button isColor="white" onClick={toggleOpen}>
            {isOpen ? "Hide " : "Show "} compiler output
        </Button>
    </div>

    {isOpen && <pre>
        {text}
    </pre>}
</div>;

interface CompilerOutputProps {
    defaultOpen?: boolean;
}

/**
 * The button in the top navbar that starts the code compilation process.
 */
const CompilerOutput: React.FC<CompilerOutputProps> = observer( ({ defaultOpen = false }) => {
    const [ isOpen, setIsOpen ] = useState( defaultOpen );

    return <CompilerOutputElement isOpen={isOpen} text={compilationResultStore.compilerOutput} toggleOpen={(): void => setIsOpen( !isOpen )} />;
});

export default CompilerOutput;
