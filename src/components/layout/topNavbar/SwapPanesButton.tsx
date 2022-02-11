import React from "react";
import { Button } from "bloomer";
import { TiChevronRight, TiDocumentText } from "react-icons/ti";
import { observer } from "mobx-react";

import ideStateStore from "stores/ideStateStore";
import { TabContentType, leftTabStore, rightTabStore } from "stores/tabStore";

export enum SwapPaneOption {
    code,
    play
}

interface SwapPanesButtonElementProps {
    disabled?: boolean;
    onClick: () => void;
    otherPane: SwapPaneOption
}

export const SwapPanesButtonElement: React.FC<SwapPanesButtonElementProps> = ({ disabled = false, onClick, otherPane }) => {
    const title = otherPane === SwapPaneOption.code ? "Show the editor" : "Show the interpreter";

    return <Button onClick={onClick} disabled={disabled} title={title}>
        {otherPane === SwapPaneOption.code ?
            <TiDocumentText className="no-margin-fix" /> :
            <TiChevronRight className="no-margin-fix" />}
    </Button>;
};


/**
 * Mobile navbar button that swaps between the code and the interpreter.
 */
const SwapPanesButton: React.FC = observer( () => {
    const activePane = ideStateStore.getActivePane();
    const otherPane = ( !activePane || activePane.type !== TabContentType.editor ) ? SwapPaneOption.code : SwapPaneOption.play;
    const codePaneId = leftTabStore.findByType( TabContentType.editor )?.id;
    const playPaneId = rightTabStore.findByType( TabContentType.interpreter )?.id;

    // If the current pane is the editor, switch to the interpreter.
    // In all other cases switch to the editor.
    const swap = (): void => {
        if( otherPane === SwapPaneOption.code ) {
            if( codePaneId ) {
                leftTabStore.setActiveTab( codePaneId );
            }
        }
        else {
            if( playPaneId ) {
                rightTabStore.setActiveTab( playPaneId );
            }
        }
    };

    // The button is disabled if the target pane doesn't exist
    const disabled = ( otherPane === SwapPaneOption.code && !codePaneId ) ||
        ( otherPane === SwapPaneOption.play && !playPaneId );

    return <SwapPanesButtonElement disabled={disabled} onClick={swap} otherPane={otherPane} />;
});

export default SwapPanesButton;
