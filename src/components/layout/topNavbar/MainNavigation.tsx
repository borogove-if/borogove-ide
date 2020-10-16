import React, { useState } from "react";
import {
    Navbar,
    NavbarBurger,
    NavbarBrand,
    NavbarEnd,
    NavbarItem,
    NavbarMenu,
    NavbarStart
} from "bloomer";
import { TiHome, TiCog, TiExport } from "react-icons/ti";

import { TabContentType } from "types/enum";

import GoButton from "./GoButton";

import { isSnippetsVariant } from "services/app/env";
import { openTab } from "services/ide/tabService";
import { firstSnippetPublish } from "services/snippets/publish";

import ideStateStore from "stores/ideStateStore";
import { TabStore, leftTabStore, rightTabStore } from "stores/tabStore";

import "./MainNavigation.scss";

const MainNavigation: React.FC = () => {
    const [ mobileMenuOpen, setMobileMenuOpen ] = useState( false );
    const openSettings = (): void => {
        openTab( TabContentType.settings, { closable: true });
        setMobileMenuOpen( false );
    };
    const openReleasePane = (): void => {
        // In snippets mode clicking the release link automatically publishes the snippet
        if( isSnippetsVariant ) {
            firstSnippetPublish();
        }

        openTab( TabContentType.release, { closable: true });
        setMobileMenuOpen( false );
    };

    const paneTabItem = ( store: TabStore, tab: Tab ): JSX.Element => <NavbarItem href="#" onClick={(): void => { store.setActiveTab( tab.id ); setMobileMenuOpen( false ); }}>
        {tab.label}
    </NavbarItem>;

    return <Navbar className="is-light">
        <NavbarBrand>
            <GoButton isHidden="desktop" />
            <NavbarBurger onClick={(): void => setMobileMenuOpen( !mobileMenuOpen )} />
        </NavbarBrand>
        <NavbarMenu isActive={mobileMenuOpen}>
            <NavbarStart>
                <NavbarItem href="/">
                    <TiHome />
                    {isSnippetsVariant ? "New Snippet" : "Project Manager"}
                </NavbarItem>
                <NavbarItem href="#" onClick={openSettings}>
                    <TiCog />
                    Settings
                </NavbarItem>
                <NavbarItem href="#" onClick={openReleasePane}>
                    <TiExport />
                    Share
                </NavbarItem>
                {!ideStateStore.wideScreenExists && <>
                    {leftTabStore.tabsList.map( tab => paneTabItem( leftTabStore, tab ) )}
                    {rightTabStore.tabsList.map( tab => paneTabItem( rightTabStore, tab ) )}
                </>}
            </NavbarStart>
            <NavbarEnd isHidden="touch">
                <GoButton />
            </NavbarEnd>
        </NavbarMenu>
    </Navbar>;
};

export default MainNavigation;