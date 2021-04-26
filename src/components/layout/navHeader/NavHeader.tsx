import React from "react";
import { Title, Navbar, NavbarBrand, NavbarItem } from "bloomer";

import "./NavHeader.scss";

interface NavHeaderElementProps {
    title: string;
}

export const NavHeaderElement: React.FC<NavHeaderElementProps> = ({ title }) => <Navbar id="nav-header" className="is-white">
    <NavbarBrand>
        <NavbarItem>
            <Title id="borogove-main-logo">
                Borogove
            </Title>
        </NavbarItem>
        <NavbarItem>
            <Title>
                {title}
            </Title>
        </NavbarItem>
    </NavbarBrand>
</Navbar>;

/**
 * Header for navigation outside the IDE
 */
const NavHeader: React.FC<NavHeaderElementProps> = ({ title }) => {
    return <NavHeaderElement title={title} />;
};

export default NavHeader;
