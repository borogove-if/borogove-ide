import React from "react";
import { TiArrowDown, TiArrowUp } from "react-icons/ti";

interface SortingIconProps {
    direction: "up" | "down";
    enabled: boolean;
    onClick: () => void;
}

export const SortingIconElement: React.FC<SortingIconProps> = ({ direction, enabled, onClick }) => <div className={`file-action-icon${enabled ? "" : " hidden"}`} onClick={onClick} title={`Move ${direction} in compilation order`}>
    {direction === "up" ? <TiArrowUp /> : <TiArrowDown />}
</div>;

/**
 * Button that moves the files up or down in the filesystem
 */
const SortingIcon: React.FC<SortingIconProps> = ( props ) => {
    return <SortingIconElement {...props} />;
};

export default SortingIcon;
