import * as React from "react";
import { Switch, Route } from "react-router";

import { DefaultScene } from "./scenes/default";

import "./App.css";

export function App() {
    return <DefaultScene />;
}