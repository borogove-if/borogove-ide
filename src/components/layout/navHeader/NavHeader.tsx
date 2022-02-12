import React from "react";
import { Title, Navbar, NavbarBrand, NavbarItem, NavbarEnd } from "bloomer";

import BrandNav from "./BrandNav";

import "./NavHeader.scss";

interface NavHeaderElementProps {
    title: string;
}

export const NavHeaderElement: React.FC<NavHeaderElementProps> = ({ title }) => <Navbar id="pm-nav-header" className="is-white">
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
    <NavbarEnd>
        <NavbarItem>
            <BrandNav />
        </NavbarItem>
    </NavbarEnd>
</Navbar>;

/**
 * Header for navigation outside the IDE
 */
const NavHeader: React.FC<NavHeaderElementProps> = ({ title }) => {
    return <NavHeaderElement title={title} />;
};

export default NavHeader;
