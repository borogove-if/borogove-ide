/**
 * The Tab Service handles creating new tabs and assigning them to panes
 */
import React, { createElement } from "react";

import FileViewer from "components/fileViewer/FileViewer";
import Interpreter from "components/interpreter/Interpreter";
import ProjectIndex from "components/projectIndex/ProjectIndex";
import PublishPane from "components/publish/PublishPane";
import ReleasePane from "components/release/ReleasePane";
import Settings from "components/settings/Settings";
import SimpleCompilationProcess from "components/compilationProcess/SimpleCompilationProcess";
import SnippetsInfo from "components/documents/snippets/SnippetsInfo";
import StagedCompilationProcess from "components/compilationProcess/StagedCompilationProcess";
import TextEditor from "components/editor/TextEditor";

import projectStore from "stores/projectStore";
import { leftTabStore, rightTabStore, TabContentType } from "stores/tabStore";


interface TabOptions {
    closable?: boolean;
    label?: string;
    props?: Record<string, unknown>;
}

// The order in which tabs are placed
const tabOrder = [
    TabContentType.editor,
    TabContentType.fileViewer,
    TabContentType.interpreter,
    TabContentType.projectIndex,
    TabContentType.compiler,
    TabContentType.release,
    TabContentType.publish,
    TabContentType.settings,
    TabContentType.welcome,
    TabContentType.snippetsInfo
];

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
 */
export function openTab( type: TabContentType, options: TabOptions = {}): void {
    const oldTab = {
        left: leftTabStore.findByType( type ),
        right: rightTabStore.findByType( type )
    };

    const { closable = false, label, props } = options;

    const addTabOptions = {
        closable,
        index: tabOrder.indexOf( type ),
        type
    };

    switch( type ) {
        case TabContentType.editor:
            if( oldTab.left ) {
                // must remove the old tab so that Monaco editor refreshes completely
                leftTabStore.removeTab( oldTab.left.id );
            }

            leftTabStore.addTab({
                ...addTabOptions,
                component: <TextEditor />,
                label: label || "Source"
            });
            break;

        case TabContentType.compiler:
            if( oldTab.right ) {
                rightTabStore.setActiveTab( oldTab.right.id );
                break;
            }

            rightTabStore.addTab({
                ...addTabOptions,
                component: projectStore.manager.compilerReportType === "staged" ? <StagedCompilationProcess /> : <SimpleCompilationProcess />,
                label: "Compiler"
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
                    ...addTabOptions,
                    component: <FileViewer file={file} />,
                    id: file.id,    // we'll reuse file ids to identify which tab contains it
                    label: label || "File"
                });
            }
            break;

        case TabContentType.interpreter:
            if( oldTab.right ) {
                rightTabStore.removeTab( oldTab.right.id );
            }

            rightTabStore.addTab({
                ...addTabOptions,
                component: <Interpreter />,
                label: "Story"
            });
            break;

        case TabContentType.projectIndex:
            if( oldTab.right ) {
                rightTabStore.removeTab( oldTab.right.id );
            }

            rightTabStore.addTab({
                ...addTabOptions,
                component: <ProjectIndex />,
                isActive: false,
                label: "Index"
            });
            break;

        case TabContentType.publish:
            if( oldTab.right ) {
                rightTabStore.removeTab( oldTab.right.id );
            }

            rightTabStore.addTab({
                ...addTabOptions,
                component: <PublishPane />,
                label: "Publish"
            });

            rightTabStore.removeTabType( TabContentType.release );
            break;

        case TabContentType.release:
            if( oldTab.right ) {
                rightTabStore.removeTab( oldTab.right.id );
            }

            rightTabStore.addTab({
                ...addTabOptions,
                component: <ReleasePane />,
                label: "Share"
            });

            rightTabStore.removeTabType( TabContentType.publish );
            break;

        case TabContentType.settings:
            if( oldTab.right ) {
                rightTabStore.removeTab( oldTab.right.id );
            }

            rightTabStore.addTab({
                ...addTabOptions,
                component: <Settings />,
                label: "Settings"
            });
            break;

        case TabContentType.snippetsInfo:
            rightTabStore.addTab({
                ...addTabOptions,
                component: <SnippetsInfo />,
                label: "About"
            });
            break;

        case TabContentType.welcome:
            if( projectStore.manager.welcomePage ) {
                rightTabStore.addTab({
                    ...addTabOptions,
                    component: createElement( projectStore.manager.welcomePage ),
                    label: "Welcome"
                });
            }
            break;
    }
}
