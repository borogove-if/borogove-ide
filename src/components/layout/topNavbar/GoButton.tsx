import React from "react";
import { Button } from "bloomer";
import { TiMediaPlay } from "react-icons/ti";
import { observer } from "mobx-react";

import compilationResultStore from "stores/compilationResultStore";
import projectStore from "stores/projectStore";

interface GoButtonElementProps {
    loading?: boolean;
    onClick: () => void;
}

export const GoButtonElement: React.FC<GoButtonElementProps> = ({ loading = false, onClick }) => <Button onClick={onClick} disabled={loading} isLoading={loading}>
    <TiMediaPlay />{" "} Go
</Button>;


/**
 * The button in the top navbar that starts the code compilation process.
 */
const GoButton: React.FC = observer( () => {
    const compile = (): Promise<boolean> => projectStore.compile( "debug" );

    return <GoButtonElement loading={compilationResultStore.isCompiling} onClick={compile} />;
});

export default GoButton;
