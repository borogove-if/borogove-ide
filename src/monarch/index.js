const languageDefinitions = {
    inform7: require( "./inform7" ).default
};

export const languages = Object.keys( languageDefinitions );

export default function register( language, monaco ) {
    if( !monaco ) {
        monaco = self.monaco;
    }

    if( !monaco ) {
        throw new Error( "Can't find Monaco editor instance" );
    }

    const definition = languageDefinitions[language];

    if( !definition ) {
        throw new Error( "Unknown language " + language );
    }

    monaco.languages.register({ id: language });
    monaco.languages.setMonarchTokensProvider( language, definition );
}

export const registerAll = ( monaco ) => languages.forEach( language => register( language, monaco ) );
