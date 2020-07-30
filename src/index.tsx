import React from "react";
import ReactDOM from "react-dom";

// MobX observer batching, see https://github.com/mobxjs/mobx-react-lite/#observer-batching
import "mobx-react-lite/batchingForReactDom";

import { initLoggers } from "services/loggers";

import App from "./App";

import "./index.scss";
import "bulmaswatch/flatly/bulmaswatch.scss";

// Initialize analytics and error tracking services
initLoggers();

// Mount the React app
ReactDOM.render( <App />, document.getElementById( "root" ) );
