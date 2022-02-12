import React, { useState } from "react";
import {
    Navbar,
    NavbarBurger,
    NavbarBrand,
    NavbarItem,
    NavbarMenu,
    NavbarStart
} from "bloomer";
import { TiHome, TiCog, TiExport, TiFolder } from "react-icons/ti";

import GoButton from "./GoButton";
import SwapPanesButton from "./SwapPanesButton";
import TabKeyButton from "./TabKeyButton";

import { isInFrame, isSnippetsVariant } from "services/app/env";
import { openTab } from "services/ide/tabService";
import { firstSnippetPublish } from "services/snippets/publish";

import { TabStore, leftTabStore, rightTabStore, TabContentType } from "stores/tabStore";

import "./MainNavigation.scss";
import ideStateStore from "stores/ideStateStore";


const MainNavigation: React.FC = () => {
    const [ mobileMenuOpen, setMobileMenuOpen ] = useState( false );

    const openFileManager = (): void => {
        if( !ideStateStore.fileManagerOpen ) {
            ideStateStore.toggleFileManager();
        }

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

    const openSettings = (): void => {
        openTab( TabContentType.settings, { closable: true });
        setMobileMenuOpen( false );
    };

    const paneTabItem = ( store: TabStore, tab: Tab ): JSX.Element => <NavbarItem key={tab.id} href="#" onClick={(): void => { store.setActiveTab( tab.id ); setMobileMenuOpen( false ); }}>
        {tab.label}
    </NavbarItem>;

    // This setup is absolutely disgusting but necessary to prevent the Bulma navbar collapsing to a mobile view too early.
    // This should be done correctly after getting rid of Bulma.
    const fullNav = <>
        <NavbarItem href="/" target={( isSnippetsVariant && isInFrame ) ? "_blank" : undefined}>
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
    </>;

    return <Navbar className="is-light">
        <NavbarBrand isHidden="mobile" style={{ width: "100%" }}>
            {fullNav}
            <div style={{ flexGrow: 1, alignSelf: "center", textAlign: "right", marginRight: "1rem" }}>
                <GoButton />
            </div>
        </NavbarBrand>
        <NavbarBrand isHidden="tablet" id="mobile-main-nav">
            <NavbarItem>
                <GoButton />
            </NavbarItem>
            <NavbarItem>
                <TabKeyButton />
            </NavbarItem>
            <NavbarItem>
                <SwapPanesButton />
            </NavbarItem>
            <NavbarBurger onClick={(): void => setMobileMenuOpen( !mobileMenuOpen )} />
        </NavbarBrand>
        <NavbarMenu isActive={mobileMenuOpen} isHidden="tablet">
            <NavbarStart>
                {fullNav}
                <NavbarItem href="#" onClick={openFileManager}>
                    <TiFolder />
                    File Manager
                </NavbarItem>
                {leftTabStore.tabsList.map( tab => paneTabItem( leftTabStore, tab ) )}
                {rightTabStore.tabsList.map( tab => paneTabItem( rightTabStore, tab ) )}
            </NavbarStart>
        </NavbarMenu>
    </Navbar>;
};

export default MainNavigation;
