import * as React from "react";
import { Routes, Route } from "react-router";

import { AddUserScene } from "./scenes/add";
import { EditUserScene } from "./scenes/edit";
import { UsersScene as UsersOverviewScene } from "./UsersScene";

export function UsersScene() {
	return <Routes>
		<Route path="/toevoegen" element={<AddUserScene />} />
		<Route path="/:userId" element={<EditUserScene />} />
		<Route path="/" element={<UsersOverviewScene />} />
	</Routes>;
}
