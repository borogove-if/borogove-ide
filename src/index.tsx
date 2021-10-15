import React from "react";
import ReactDOM from "react-dom";

import { initLoggers } from "services/app/loggers";
import { initFirebase } from "services/firebase/setup";

import App from "./App";

import "./index.scss";
import "bulmaswatch/flatly/bulmaswatch.scss";

// Initialize analytics and error tracking services
initLoggers();

// Initialize Firebase
initFirebase();

// Mount the React app
ReactDOM.render( <App />, document.getElementById( "root" ) );
