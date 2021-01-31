import * as React from "react";

import { useNavigate } from "react-router-dom"; 

import { Button } from "../../../../../../../../components/Button";

import * as styles from "./index.css";

export function VerzondenScene() {
	const navigate = useNavigate();

	const onAddClick = React.useCallback(function() {
		navigate("../toevoegen");
	}, [navigate]);

	const onBackClick = React.useCallback(function() {
		navigate("../");
	}, [navigate]);

	return <>
		<div className={styles.messageContainer}>
			De dekverklaring is verzonden.
		</div>
		
		<Button onClick={onAddClick} className={styles.button}>Nog een verklaring indienen voor een ander ras</Button>
		<Button onClick={onBackClick} className={styles.button}>Terug naar het overzicht</Button>
	</>;
}
