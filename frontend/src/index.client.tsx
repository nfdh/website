import * as React from "react";
import * as ReactDOM from "react-dom";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

import RelayEnvironment from "./relay-environment";

const rootElement = document.getElementById("root");
const root = ReactDOM.unstable_createRoot(rootElement, { hydrate: true });

root.render(
    <RelayEnvironmentProvider environment={RelayEnvironment}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </RelayEnvironmentProvider>
);
