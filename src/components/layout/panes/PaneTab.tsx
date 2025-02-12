import React, { ReactElement } from "react";
import { observer } from "mobx-react";
import { Tab, TabLink } from "bloomer";
import { TiTimes } from "react-icons/ti";

import "./PaneTab.scss";

interface PaneTabElementProps {
    isActive?: boolean;
    isClosable?: boolean;
    label: string | ReactElement;
    onClick: () => void;
    onClose?: () => void;
}

export const PaneTabElement: React.FC<PaneTabElementProps> = ({
    isActive = false,
    isClosable = false,
    label,
    onClick,
    onClose
}) => (
    <Tab
        className={"panetab" + (isClosable ? " closable" : "")}
        isActive={isActive}>
        <TabLink onClick={onClick}>
            {label}
            {isClosable && (
                <TiTimes
                    className="close-tab"
                    onClick={(e): void => {
                        e.stopPropagation();
                        if (onClose) {
                            onClose();
                        }
                    }}
                    title="Close tab"
                />
            )}
        </TabLink>
    </Tab>
);

/**
 * A single pane tab.
 */
const PaneTab: React.FC<PaneTabElementProps> = observer(props => {
    return <PaneTabElement {...props} />;
});

export default PaneTab;
