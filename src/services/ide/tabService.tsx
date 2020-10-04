/**
 * The Tab Service handles creating new tabs and assigning them to panes
 */
import React, { createElement } from "react";

import FileViewer from "components/fileViewer/FileViewer";
import Interpreter from "components/interpreter/Interpreter";
import ProjectIndex from "components/projectIndex/ProjectIndex";
import Settings from "components/settings/Settings";
import SimpleCompilationProcess from "components/compilationProcess/SimpleCompilationProcess";
import StagedCompilationProcess from "components/compilationProcess/StagedCompilationProcess";
import TextEditor from "components/editor/TextEditor";

import projectStore from "stores/projectStore";
import { leftTabStore, rightTabStore } from "stores/tabStore";

import { TabContentType } from "types/enum";
import ReleasePane from "../../components/release/ReleasePane";
import SnippetsInfo from "../../components/snippets/SnippetsInfo";

interface TabOptions {
    closable?: boolean;
    label?: string;
    props?: Record<string, unknown>;
}


/**
 * Close all tabs that are of certain type.
 */
export function closeTabsByType( type: TabContentType ): void {
    let tab;

    // eslint-disable-next-line
    while( tab = leftTabStore.findByType( type ) ) {
        leftTabStore.removeTab( tab.id );
    }

    // eslint-disable-next-line
    while( tab = rightTabStore.findByType( type ) ) {
        leftTabStore.removeTab( tab.id );
    }
}


/**
 * Opens a tab.
 *
 * @param type Which tab to open
 * @param label Custom text to show in the tab
 */
export function openTab( type: TabContentType, options: TabOptions = {}): void {
    const oldTab = {
        left: leftTabStore.findByType( type ),
        right: rightTabStore.findByType( type )
    };

    const { closable = false, label, props } = options;

    switch( type ) {
        case TabContentType.editor:
            if( oldTab.left ) {
                // must remove the old tab so that Monaco editor refreshes completely
                leftTabStore.removeTab( oldTab.left.id );
            }

            leftTabStore.addTab({
                closable,
                component: <TextEditor />,
                index: 1,
                label: label || "Source",
                type
            });
            break;

        case TabContentType.compiler:
            if( oldTab.right ) {
                rightTabStore.setActiveTab( oldTab.right.id );
                break;
            }

            rightTabStore.addTab({
                closable,
                component: projectStore.manager.compilerReportType === "staged" ? <StagedCompilationProcess /> : <SimpleCompilationProcess />,
                label: "Compiler",
                index: 2,
                type
            });
            break;

        case TabContentType.fileViewer:
            {
                const file = ( props as { file: MaterialsFile }).file;

                if( leftTabStore.findById( file.id ) ) {
                    // this file is already open in a tab, select it
                    leftTabStore.setActiveTab( file.id );
                    break;
                }

                leftTabStore.addTab({
                    closable,
                    component: <FileViewer file={file} />,
                    id: file.id,    // we'll reuse file ids to identify which tab contains it
                    index: 2,
                    label: label || "File",
                    type
                });
            }
            break;

        case TabContentType.interpreter:
            if( oldTab.right ) {
                rightTabStore.removeTab( oldTab.right.id );
            }

            rightTabStore.addTab({
                closable,
                component: <Interpreter />,
                label: "Story",
                index: 1,
                type
            });
            break;

        case TabContentType.projectIndex:
            if( oldTab.right ) {
                rightTabStore.removeTab( oldTab.right.id );
            }

            rightTabStore.addTab({
                closable,
                component: <ProjectIndex />,
                isActive: false,
                label: "Index",
                type
            });
            break;

        case TabContentType.release:
            if( oldTab.right ) {
                rightTabStore.removeTab( oldTab.right.id );
            }

            rightTabStore.addTab({
                closable,
                component: <ReleasePane />,
                label: "Release",
                type
            });
            break;

        case TabContentType.settings:
            if( oldTab.right ) {
                rightTabStore.removeTab( oldTab.right.id );
            }

            rightTabStore.addTab({
                closable,
                component: <Settings />,
                label: "Settings",
                type
            });
            break;

        case TabContentType.snippetsInfo:
            rightTabStore.addTab({
                closable,
                component: <SnippetsInfo />,
                label: "Snippets",
                index: 3,
                type
            });
            break;

        case TabContentType.welcome:
            if( projectStore.manager.welcomePage ) {
                rightTabStore.addTab({
                    closable,
                    component: createElement( projectStore.manager.welcomePage ),
                    label: "Welcome",
                    index: 3,
                    type
                });
            }
            break;
    }
}