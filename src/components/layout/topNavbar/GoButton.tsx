import React from "react";
import { Button, NavbarItem } from "bloomer";
import { TiMediaPlay } from "react-icons/ti";
import { observer } from "mobx-react";

import compilationResultStore from "stores/compilationResultStore";
import projectStore from "stores/projectStore";

interface GoButtonElementProps {
    isHidden?: "desktop" | "touch" | "mobile" | "tablet" | "widescreen" | "tablet-only" | "desktop-only";
    loading?: boolean;
    onClick: () => void;
}

export const GoButtonElement: React.FC<GoButtonElementProps> = ({ isHidden, loading = false, onClick }) => <NavbarItem isHidden={isHidden}>
    <Button onClick={onClick} disabled={loading} isLoading={loading}>
        <TiMediaPlay />{" "} Go
    </Button>
</NavbarItem>;


interface GoButtonProps {
    isHidden?: "desktop" | "touch" | "mobile" | "tablet" | "widescreen" | "tablet-only" | "desktop-only";
}

/**
 * The button in the top navbar that starts the code compilation process.
 */
const GoButton: React.FC<GoButtonProps> = observer( ({ isHidden }) => {
    const compile = (): Promise<boolean> => projectStore.compile( "debug" );

    return <GoButtonElement isHidden={isHidden} loading={compilationResultStore.isCompiling} onClick={compile} />;
});

export default GoButton;
