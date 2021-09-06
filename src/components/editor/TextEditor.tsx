import React from "react";
import { observer } from "mobx-react";
import MonacoEditor, { EditorConstructionOptions, EditorDidMount } from "react-monaco-editor";
import { registerAll } from "monarch";

import editorStateStore from "stores/editorStateStore";
import projectStore from "stores/projectStore";
import settingsStore from "stores/settingsStore";
import { isSnippetsVariant } from "services/app/env";

import "./TextEditor.scss";

interface TextEditorElementProps {
    language?: string;
    onChange: ( newValue: string ) => void;
    options: EditorConstructionOptions;
    setInitialCursorPosition: ( editor: MonacoEditor[ "editor" ] ) => void;
    theme: string;
    value: string;
}

/**
 * The code editor itself. We're using Monaco, see:
 * https://microsoft.github.io/monaco-editor/
 * https://github.com/react-monaco-editor/react-monaco-editor
 * https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html
 */
export const TextEditorElement: React.FC<TextEditorElementProps> = ( props ) => {
    const editorDidMount: EditorDidMount = ( mountedEditor ) => {
        mountedEditor.focus();
        mountedEditor.layout();
        props.setInitialCursorPosition( mountedEditor );
    };

    const editorWillMount = ( monaco: unknown ): void => {
        // Register custom syntax highlighting rules for the editor
        registerAll( monaco );
    };

    return <div className="editor-container">
        <MonacoEditor editorDidMount={editorDidMount}
                      editorWillMount={editorWillMount}
                      {...props} />
    </div>;
};

// see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html
// These are exported so that we can use them in the Storybook stories
export const defaultOptions: EditorConstructionOptions = {
    automaticLayout: true,
    cursorStyle: "line",
    readOnly: false,
    roundedSelection: false,
    selectOnLineNumbers: true,
    wordWrap: "on"
};

const TextEditor: React.FC = observer( () => {
    const { contents, initialCursorPosition, language, theme } = editorStateStore;

    // when text is entered, send it to the state store which handles passing
    // it to other components that need it, and saving it
    const onChange = ( newValue: string ): void => {
        editorStateStore.setContents( newValue, false );
    };

    const setInitialCursorPosition = ( editor: MonacoEditor[ "editor" ] ): void => {
        if( initialCursorPosition && editor ) {
            editor.setPosition( initialCursorPosition );

            // this should be done only once, not every time the editor opens!
            editorStateStore.initialCursorPosition = null;
        }
    };

    const options: EditorConstructionOptions = {
        ...defaultOptions,
        copyWithSyntaxHighlighting: false,
        fontFamily: ( settingsStore.getSetting( "editor", "fontFamily" ) === "sans-serif" )
            ? "Lato, Arial, sans-serif"
            : "Menlo, Monaco, \"Courier New\", monospace",
        fontSize: settingsStore.getSetting( "editor", "fontSize" ),
        lineNumbers: settingsStore.getSetting( "editor", "lineNumbers" ),
        minimap: { enabled: settingsStore.getSetting( "editor", "minimap" ) },
        quickSuggestions: settingsStore.getSetting( "editor", "quickSuggestions" ),
        wordWrap: settingsStore.getSetting( "editor", "wordWrap" ) ? "on" : "off",
        wrappingIndent: settingsStore.getSetting( "editor", "wrappingIndent" ) ? "indent" : "none",
        readOnly: isSnippetsVariant && projectStore.entryFile?.id !== editorStateStore.file?.id
    };

    return <TextEditorElement language={language}
                              theme={theme}
                              value={contents}
                              options={options}
                              setInitialCursorPosition={setInitialCursorPosition}
                              onChange={onChange} />;
});

export default TextEditor;
