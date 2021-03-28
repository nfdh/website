import * as React from "react";
import { Form } from "formulizer";
import { useNavigate } from "react-router";
import { useRelayEnvironment } from "react-relay/hooks";

import { commitAddUser, FailedAddUserReason } from "./mutations/AddUserMutation"; 
import { Actions } from "../../../../../../../../components/Form";
import { Button, ButtonVariant } from "../../../../../../../../components/Button";
import { UserForm, UserFormValues } from "../../components/UserForm";
import { toast } from "react-toastify";

import styles from "./index.css";

interface AddUserForm
	extends UserFormValues
{

}

export function AddUserScene() {
	const environment = useRelayEnvironment();

    const [isBusy, setIsBusy] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

	const onFormSubmit = React.useCallback(function(values: AddUserForm) {
		if (isBusy) {
            return;
        }

        setErrorMessage(null);
        setIsBusy(true);

		const userObj = {
			email: values.email,
			name: values.name,
			
			studbook_heideschaap: values.studbook_heideschaap 
				? { ko: values.studbook_heideschaap_ko } 
				: null,

			studbook_schoonebeeker: values.studbook_schoonebeeker
				? { ko: values.studbook_schoonebeeker_ko }
				: null,

			role_website_contributor: values.role_website_contributor,
			role_studbook_administrator: values.role_studbook_administrator,
			role_studbook_inspector: values.role_studbook_inspector
		};

		commitAddUser(environment, userObj,
			function(e) {
				setErrorMessage(getErrorMessage(null));
				setIsBusy(false);
			},
			function(r, e) {
				if(r.addUser.user) {
					toast("De gebruiker is toegevoegd", { type: "success" });
					navigate("../" + r.addUser.user.id, { state: { hasAdded: true } });
				}
				else {
					setErrorMessage(getErrorMessage(r.addUser.reason));
					setIsBusy(false);
				}
			}
		);
	}, []);

	const navigate = useNavigate();

	const onCancelClick = React.useCallback(function() {
		navigate("../");
	}, [navigate]);

	const defaultValue: AddUserForm = {
		email: "",
		name: "",
		role_studbook_administrator: false,
		role_studbook_inspector: false,
		role_website_contributor: false,
		studbook_heideschaap: false,
		studbook_heideschaap_ko: false,
		studbook_schoonebeeker: false,
		studbook_schoonebeeker_ko: false
	};

	return <div>
		<h2 className={styles.title}>Gebruiker toevoegen</h2>
		<Form onSubmit={onFormSubmit} defaultValue={defaultValue}>
			{errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

			<UserForm addNew={true} />

			<Actions>
				<Button type="submit" variant={ButtonVariant.Primary}>Toevoegen</Button>
				<Button onClick={onCancelClick}>Annuleren</Button>
			</Actions>
		</Form>
	</div>;
}

function getErrorMessage(reason: FailedAddUserReason | null) {
	switch(reason) {
		case "UNAUTHORIZED": return "U heeft niet de benodigde rechten om een gebruiker toe te voegen.";
		case "EMAIL_IN_USE": return "Er bestaat al een gebruiker met het opgegeven e-mail adres.";
		default: return "Er is een fout opgetreden tijdens het aanmaken van de gebruiker, probeer het later opnieuw.";
	}
}