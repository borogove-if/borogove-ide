import React from "react";
import { createRoot } from "react-dom/client";

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
const container = document.getElementById("root");

if (!container) {
    throw new Error("Root element (#root) not found");
}

const root = createRoot(container);
root.render(<App />);
