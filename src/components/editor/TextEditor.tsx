import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { useCodeMirror } from "@uiw/react-codemirror";

import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets";
import { defaultKeymap } from "@codemirror/commands";
import { commentKeymap } from "@codemirror/comment";
import { foldGutter, foldKeymap } from "@codemirror/fold";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter";
import { defaultHighlightStyle } from "@codemirror/highlight";
import { history, historyKeymap } from "@codemirror/history";
import { indentOnInput } from "@codemirror/language";
import { bracketMatching } from "@codemirror/matchbrackets";
import { rectangularSelection } from "@codemirror/rectangular-selection";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { EditorState, Extension } from "@codemirror/state"; // This package isn't listed in package.json because it then conflicts with @uiw/react-codemirror for some reason. It's included through that package instead. Can try installing it as a first-class package if either of them get updates later.
import { EditorView, keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor } from "@codemirror/view";

import editorStateStore from "stores/editorStateStore";
import projectStore from "stores/projectStore";
import settingsStore from "stores/settingsStore";
import { isSnippetsVariant } from "services/app/env";

interface TextEditorElementProps {
    language?: string;
    onChange: ( newValue: string ) => void;
    options: EditorOptions;
    value: string;
}

interface EditorOptions {
    editable: boolean;
    fontFamily: string;
    fontSize: number;
    indentWithTab: boolean;
    lineNumbers: boolean;
    wordWrap: boolean;
    wrappingIndent: boolean;
}

// These are exported so that we can use them in the Storybook stories
export const defaultOptions: EditorOptions = {
    editable: true,
    fontFamily: "monospace",
    fontSize: 15,
    indentWithTab: true,
    lineNumbers: true,
    wordWrap: true,
    wrappingIndent: true
};

/**
 * The code editor itself. We're using CodeMirror 6, see https://codemirror.net/6/docs/ and https://github.com/uiwjs/react-codemirror/
 */
export const TextEditorElement: React.FC<TextEditorElementProps> = ({ onChange, options, value }) => {
    let extensions: Extension[] = [
        highlightSpecialChars(),
        history(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of( true ),
        indentOnInput(),
        defaultHighlightStyle.fallback,
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of( [
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...commentKeymap,
            ...completionKeymap
        ] )
    ];

    if( options.lineNumbers ) {
        // line numbers option enables or disables the entire gutter
        extensions = [
            ...extensions,
            lineNumbers(),
            highlightActiveLineGutter(),
            foldGutter()
        ];
    }

    if( options.wordWrap ) {
        extensions.push( EditorView.lineWrapping );
    }

    const theme = EditorView.theme({
        ".cm-content": {
            fontFamily: options.fontFamily,
            paddingLeft: options.wrappingIndent ? "1.5em" : "0",
            textIndent: options.wrappingIndent ? "-1.5em" : "0"
        },
        ".cm-content, .cm-gutters": {
            fontSize: options.fontSize + "px"
        }
    });

    const editorRef = useRef<HTMLDivElement>( null );
    const { setContainer, view } = useCodeMirror({
        autoFocus: true,
        basicSetup: false,
        container: editorRef.current,
        editable: options.editable,
        extensions,
        onChange,
        theme,
        value
    });

    useEffect( () => {
        if( editorRef.current ) {
            setContainer( editorRef.current );
        }
    }, [ editorRef.current ] );

    useEffect( () => {
        editorStateStore.setEditorReference( view );
    }, [ view ] );

    return <div ref={editorRef} className="editor-container" />;
};

const TextEditor: React.FC = observer( () => {
    const { contents, language } = editorStateStore;

    // when text is entered, send it to the state store which handles passing
    // it to other components that need it, and saving it
    const onChange = ( newValue: string ): void => {
        editorStateStore.setContents( newValue, false );
    };

    // editing is disabled only in Snippets for all files that aren't the main file
    const editable = !( isSnippetsVariant && projectStore.entryFile?.id !== editorStateStore.file?.id );
    const fontFamily = ( settingsStore.getSetting( "editor", "fontFamily" ) === "sans-serif" )
        ? "Lato, Arial, sans-serif"
        : "Menlo, Monaco, \"Courier New\", monospace";
    const fontSize = settingsStore.getSetting( "editor", "fontSize" );
    const lineNumbers = settingsStore.getSetting( "editor", "lineNumbers" );
    const wordWrap = settingsStore.getSetting( "editor", "wordWrap" );
    const wrappingIndent = settingsStore.getSetting( "editor", "wrappingIndent" );

    const options: EditorOptions = {
        ...defaultOptions,
        editable,
        fontFamily,
        fontSize,
        lineNumbers,
        wordWrap,
        wrappingIndent
    };

    return <TextEditorElement language={language}
                              value={contents}
                              options={options}
                              onChange={onChange} />;
});

export default TextEditor;
