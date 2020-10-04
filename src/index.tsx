import React from "react";
import ReactDOM from "react-dom";

import { initLoggers } from "services/app/loggers";

import App from "./App";

import "./index.scss";
import "bulmaswatch/flatly/bulmaswatch.scss";

// Initialize analytics and error tracking services
initLoggers();

// Mount the React app
ReactDOM.render( <App />, document.getElementById( "root" ) );
