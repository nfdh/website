import * as React from "react";

import { Button, ButtonVariant } from "../../../../../../../../components/Button";
import { TextInput } from "../../../../../../../../components/TextInput";
import { Checkbox } from "../../../../../../../../components/Checkbox";

import styles from "./index.css";

export function AddUserScene() {

	return <div>
		<h2 className={styles.title}>Gebruiker toevoegen</h2>
		<form action="#">
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Inloggegevens</h3>
				<div className={styles.row}>
					<label className={styles.label} htmlFor="tiem">E-mail</label>
					<div className={styles.inputContainer}>
						<TextInput type="email" id="tiem" placeholder="naam@domein.nl" />
					</div>
				</div>
				<div className={styles.row}>
					<label className={styles.label}>Wachtwoord</label>
					<div className={styles.inputContainer}>
						<i>Wordt automatisch aangemaakt en verstuurd naar het bovenstaande e-mail adres</i>
					</div>
				</div>
			</div>
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Persoonsgegevens</h3>
				<div className={styles.row}>
					<label className={styles.label} htmlFor="tina">Naam</label>
					<div className={styles.inputContainer}>
						<TextInput type="text" id="tina" />
					</div>
				</div>
			</div>
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Rechten</h3>
				<div className={styles.row}>
					<Checkbox label="Stamboek Drents Heideschaap" />
				</div>
				<div className={styles.row}>
					<Checkbox label="Stamboek Schoonebeeker" />
				</div>
				<div className={styles.row}>
					<Checkbox label="Kudde overeenkomst" />
				</div>
				<div className={styles.row}>
					<Checkbox label="Website beheerder" />
				</div>
				<div className={styles.row}>
					<Checkbox label="Stamboek administratie" />
				</div>
				<div className={styles.row}>
					<Checkbox label="Keuringsmeester" />
				</div>
			</div>

			<div className={styles.buttonSet}>
				<Button className={styles.button} variant={ButtonVariant.Primary}>Toevoegen</Button>
				<Button className={styles.button}>Annuleren</Button>
			</div>
		</form>
	</div>;
}
