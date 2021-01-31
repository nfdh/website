import * as React from "react";
import { Routes, Route } from "react-router";

import { AddFormDekverklaringScene } from "./scenes/add";
import { FormsScene } from "./FormsScene";
import { VerzondenScene } from "./scenes/verzonden";

export function FormDekverklaring() {
	return <Routes>
		<Route path="/toevoegen" element={<AddFormDekverklaringScene />} />
		<Route path="/verzonden" element={<VerzondenScene />} />
		<Route path="/" element={<FormsScene />} />
	</Routes>;
}
