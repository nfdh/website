import * as React from "react";
import { Switch, Route } from "react-router";

import { DefaultScene } from "./scenes/default";
import { MemberScene } from "./scenes/member";

import "./App.css";

export function App() {
    return <Switch>
        <Route path="/ledenportaal" component={MemberScene} />
        <Route component={DefaultScene} />
    </Switch>;
}