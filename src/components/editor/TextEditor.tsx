import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { EditorView, keymap, highlightSpecialChars, drawSelection, dropCursor, useCodeMirror } from "@uiw/react-codemirror";

import {
    autocompletion,
    closeBrackets,
    closeBracketsKeymap,
    completionKeymap
} from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { defaultHighlightStyle } from "@codemirror/highlight";
import {
    bracketMatching,
    foldGutter,
    foldKeymap,
    indentOnInput,
    indentService,
    indentUnit
} from "@codemirror/language";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { EditorState, Extension } from "@codemirror/state";
import { highlightActiveLineGutter, lineNumbers, rectangularSelection } from "@codemirror/view";

import { languages } from "@codemirror/language-data";
import { inform7 } from "codemirror-lang-inform7";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";

import editorStateStore from "stores/editorStateStore";
import projectStore from "stores/projectStore";
import settingsStore from "stores/settingsStore";
import { isSnippetsVariant } from "services/app/env";

const TAB_SIZE = 4;

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
    lineNumbers: boolean;
    syntaxHighlighting: boolean;
    tabChars: string;
    wordWrap: boolean;
    wrappingIndent: boolean;
}

// These are exported so that we can use them in the Storybook stories
export const defaultOptions: EditorOptions = {
    editable: true,
    fontFamily: "monospace",
    fontSize: 15,
    lineNumbers: true,
    syntaxHighlighting: true,
    tabChars: "    ",
    wordWrap: true,
    wrappingIndent: true
};

/**
 * The code editor itself. We're using CodeMirror 6, see https://codemirror.net/6/docs/ and https://github.com/uiwjs/react-codemirror/
 */
export const TextEditorElement: React.FC<TextEditorElementProps> = ({ onChange, options, value }) => {
    let extensions: Extension[] = [
        autocompletion(),
        bracketMatching(),
        closeBrackets(),
        defaultHighlightStyle.fallback,
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of( true ),
        EditorState.tabSize.of( TAB_SIZE ),
        highlightSelectionMatches(),
        highlightSpecialChars(),
        history(),
        indentOnInput(),
        rectangularSelection(),
        keymap.of( [
            ...closeBracketsKeymap,
            ...completionKeymap,
            ...defaultKeymap,
            ...foldKeymap,
            ...historyKeymap,
            ...searchKeymap
        ] )
    ];

    // Set code highlighting to the detected language.
    if( options.syntaxHighlighting ) {
        switch( editorStateStore.language ) {
            case "css":
                extensions.push( css() );
                break;

            case "inform7":
                extensions.push( inform7() );
                break;

            case "javascript":
                extensions.push( javascript() );
                break;

            case "json":
                extensions.push( json() );
                break;

            case "markdown":
                extensions.push( markdown({ base: markdownLanguage, codeLanguages: languages }) );
                break;
        }
    }

    // set the indent characters to tab or spaces
    extensions.push( indentUnit.of( options.tabChars ) );

    // indents the next line based on how much the previous one was indented
    const autoIndentExtension = indentService.of( ( context, pos ) => {
        const previousLine = context.lineAt( pos, -1 );

        // if the previous line has no text other than whitespace, don't indent the next line
        if( previousLine.text.trim().length === 0 ) {
            return 0;
        }

        const previousIndentChars = previousLine.text.match( new RegExp( `^(${options.tabChars})*` ) );
        const multiplier = ( options.tabChars[0] === "\t" ) ? TAB_SIZE : 1;   // when using tabs for indentation, must multiply the result by tab length for the editor to insert tab characters

        return previousIndentChars ? previousIndentChars[0]?.length * multiplier : 0;
    });
    extensions.push( autoIndentExtension );

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
    const syntaxHighlighting = settingsStore.getSetting( "language", "syntaxHighlighting", true );
    const tabChars = projectStore.manager.tabIndent ? "\t" : "    ";
    const wordWrap = settingsStore.getSetting( "editor", "wordWrap" );
    const wrappingIndent = settingsStore.getSetting( "editor", "wrappingIndent" );

    const options: EditorOptions = {
        ...defaultOptions,
        editable,
        fontFamily,
        fontSize,
        lineNumbers,
        syntaxHighlighting,
        tabChars,
        wordWrap,
        wrappingIndent
    };

    return <TextEditorElement language={language}
                              value={contents}
                              options={options}
                              onChange={onChange} />;
});

export default TextEditor;
