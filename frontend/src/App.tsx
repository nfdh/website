import * as React from "react";

import { DefaultScene } from "./scenes/default";

import "./App.css";

export function App() {
    return <React.Suspense fallback={""}>
        <DefaultScene />
    </React.Suspense>;
}