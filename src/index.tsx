import React from "react";
import ReactDOM from "react-dom";

import { isSnippetsVariant } from "services/app/env";
import { initLoggers } from "services/app/loggers";
import { initFirebase } from "services/snippets/import";

import App from "./App";

import "./index.scss";
import "bulmaswatch/flatly/bulmaswatch.scss";

// Initialize analytics and error tracking services
initLoggers();

// Initialize Firebase
if( isSnippetsVariant ) {
    initFirebase();
}

// Mount the React app
ReactDOM.render( <App />, document.getElementById( "root" ) );
