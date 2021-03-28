import * as React from "react";
import classnames from "classnames";
import { Form, useFormValue } from "formulizer";
import { useLocation, useNavigate, useParams } from "react-router";
import { graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay/hooks";
import { toast } from "react-toastify";

import { commitUpdateUser, FailedUpdateUserReason } from "./mutations/UpdateUserMutation"; 
import { Actions } from "../../../../../../../../components/Form";
import { Button, ButtonVariant } from "../../../../../../../../components/Button";
import { UserForm, UserFormSkeleton, UserFormValues } from "../../components/UserForm";

import { EditUserSceneQuery } from "./__generated__/EditUserSceneQuery.graphql";
import styles from "./index.css";

interface EditUserForm 
    extends UserFormValues
{

}

export function EditUserScene() {
	const { userId } = useParams();

	const user = useLazyLoadQuery<EditUserSceneQuery>(graphql`
		query EditUserSceneQuery($userId: ID!) {
            user(id: $userId) {
                email
                name
                
                studbook_heideschaap {
                    ko
                }
                studbook_schoonebeeker {
                    ko
                }

                role_website_contributor
                role_studbook_administrator
                role_studbook_inspector
            }
        }
	`, {
		userId: userId
	})
	
	const environment = useRelayEnvironment();

    const [isBusy, setIsBusy] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

	const navigate = useNavigate();

	const onFormSubmit = React.useCallback(function(values: EditUserForm) {
		if (isBusy) {
            return;
        }

        setErrorMessage(null);
        setIsBusy(true);

		const userObj = {
			email: values.email,
			name: values.name,

			studbook_heideschaap: values.studbook_heideschaap 
				? { ko: !!values.studbook_heideschaap_ko } 
				: null,

			studbook_schoonebeeker: values.studbook_schoonebeeker
				? { ko: !!values.studbook_schoonebeeker_ko }
				: null,

			role_website_contributor: !!values.role_website_contributor,
			role_studbook_administrator: !!values.role_studbook_administrator,
			role_studbook_inspector: !!values.role_studbook_inspector
		};

		commitUpdateUser(environment, userId, userObj,
			function(e) {
				setErrorMessage(getErrorMessage(null));
				setIsBusy(false);
			},
			function(r, e) {
				if(r.updateUser.reason) {
					setErrorMessage(getErrorMessage(r.updateUser.reason));
				}
                else {
                    toast("De gebruiker is bijgewerkt", { type: "success" });
                }

				setIsBusy(false);
			}
		);
	}, [userId]);

	const onCancelClick = React.useCallback(function() {
		navigate("../");
	}, [navigate]);

	const defaultValue: EditUserForm = {
		email: user.user.email,
		name: user.user.name,
		role_studbook_administrator: user.user.role_studbook_administrator,
		role_studbook_inspector: user.user.role_studbook_inspector,
		role_website_contributor: user.user.role_website_contributor,
		studbook_heideschaap: user.user.studbook_heideschaap !== null,
		studbook_heideschaap_ko: user.user.studbook_heideschaap?.ko,
		studbook_schoonebeeker: user.user.studbook_schoonebeeker !== null,
		studbook_schoonebeeker_ko: user.user.studbook_schoonebeeker?.ko
	};

	return <div>
		<Form onSubmit={onFormSubmit} defaultValue={defaultValue}>
			<Title />

			{errorMessage ? <div className={styles.errorMessage}>{errorMessage}</div> : null}

			<UserForm addNew={false} />

			<Actions>
				<Button type="submit" variant={ButtonVariant.Primary}>Bijwerken</Button>
				<Button onClick={onCancelClick}>Annuleren</Button>
			</Actions>
		</Form>
	</div>;
}

export function Title() {
	const [name, _] = useFormValue<string>("name");

	return <h2 className={styles.title}>Gebruiker {name}</h2>;
}

export function EditUserSceneSkeleton() {
	const navigate = useNavigate();
	const onCancelClick = React.useCallback(function() {
		navigate("../");
	}, [navigate]);

	return <div>
		<h2 className={styles.title}>Gebruiker bijwerken</h2>
		<UserFormSkeleton addNew={false} />

		<Actions>
			<Button type="submit" variant={ButtonVariant.Primary} disabled>Bijwerken</Button>
			<Button onClick={onCancelClick}>Annuleren</Button>
		</Actions>
	</div>;	
}

function getErrorMessage(reason: FailedUpdateUserReason | null) {
	switch(reason) {
		case "UNAUTHORIZED": return "U heeft niet de benodigde rechten om een gebruiker te wijzigen.";
		case "EMAIL_IN_USE": return "Er bestaat al een gebruiker met het opgegeven e-mail adres.";
		default: return "Er is een fout opgetreden tijdens het bijwerken van de gebruiker, probeer het later opnieuw.";
	}
}