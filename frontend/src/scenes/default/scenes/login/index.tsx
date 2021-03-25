import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useRelayEnvironment } from "react-relay/hooks";
import { Form, Input } from "formulizer";

import { TextInput } from "../../../../components/TextInput";
import { Checkbox } from "../../../../components/Checkbox";
import { Button, ButtonGroup, ButtonVariant } from "../../../../components/Button";

import { login } from "../../../../services/auth";

import * as styles from "./index.css";

interface LoginSceneProps {

}

interface LoginForm {
	username: string;
	password: string
}

export function LoginScene(props: LoginSceneProps) {
    const environment = useRelayEnvironment();
    const navigate = useNavigate();

    const [isBusy, setIsBusy] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const onLoginSubmit = React.useCallback(function(values: LoginForm) {  
        if (isBusy) {
            return;
        }

        setErrorMessage(null);
        setIsBusy(true);

        login(environment, values.username, values.password)
            .then(function(result) {
                if (result.success) {
                    navigate("/ledenportaal");
                }
                else {
                    setIsBusy(false);
                    setErrorMessage("De combinatie van e-mailadres en wachtwoord is onjuist");
                }
            })
            .catch(function() {
                setIsBusy(false);
                setErrorMessage("Er is een fout opgetreden tijdens het inloggen, probeer het later opnieuw.");
            });
    }, [isBusy, navigate]);

    return <div className={styles.center}>
        <h1>Inloggen</h1>

        <div className={styles.container}>
            <div className={styles.portalLoginContent}>
                <h2>Ledenportaal</h2>
                <p>
                    Via het ledenportaal kunt u de volgende acties zelf regelen:
                </p>
                <ul>
                    <li>Invoeren jaarlijkse dekverklaring</li>
                    <li>Aanmelden voor huiskeuring</li>
                    <li>Advertenties plaatsen voor koop en verkoop van schapen, wol of vlees</li>
                    <li>Inzien fokrammenlijst</li>
                </ul>
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                <Form className={styles.loginForm} onSubmit={onLoginSubmit}>
                    <TextInput icon="email" className={styles.usernameInput} name="username" type="text" placeholder="E-mailadres" readOnly={isBusy} />
                    <TextInput icon="lock" className={styles.passwordInput} name="password" type="password" placeholder="Wachtwoord" readOnly={isBusy} />
                    <Checkbox labelClassName={styles.stayLoggedInLabel} label="Ingelogd blijven" readOnly={isBusy} />
                    <Button variant={ButtonVariant.Primary} className={styles.loginButton} type="submit" disabled={isBusy}>Inloggen</Button>
                </Form>
            </div>
            <div className={styles.falcooLoginContent}>
                <h2>Falcoo</h2>
                <p>
                    Falcoo is een applicatie die de vereniging gebruikt om het stamboek te administreren.
                    U kunt hierop inloggen om de volgende zaken omtrent het stamboek zelf te regelen:
                </p>
                <ul>
                    <li>Ingeven lammeren (alleen indien beide ouders geregistreerd zijn);</li>
                    <li>Alle afvoeren. Afvoeren binnen de NFDH komen automatisch op naam van de fokker/koper te staan</li>
                    <li>Sterftes</li>
                </ul>
                <br />
                <ButtonGroup className={styles.falcooButtons}>
                    <Button href="https://vnl.falcooonline.com/" target="_blank" variant={ButtonVariant.Primary} className={styles.falcooButton}>Inloggen</Button>
                    <Button href="https://vnl.falcooonline.com/handleidingen/HetDrentseHeideschaap.pdf" target="_blank" className={styles.falcooButton}>Handleiding</Button>
                    <Button href="https://www.youtube.com/watch?v=_H1BMioZ85Y" target="_blank" className={styles.falcooButton}>Instructiefilmpje</Button> 
                </ButtonGroup>
            </div>
            <div className={styles.otherContent}>
                <h2>Overige zaken</h2>
                <p>
                    De volgende zaken kunt u niet zelf regelen, maar moet u telefonisch of per e-mail doorgeven aan de stamboekadministratie:
                </p>
                <ul>
                    <li>aanvoeren vanaf een niet NFDH lid</li>
                    <li>geboortes waarvan één of beide ouders onbekend zijn</li>
                    <li>genotype (indien u een dier laat onderzoeken)</li>
                    <li>keuringsuitslagen worden door de stamboekadministratie ingevoerd</li>
                    <li>herstelwerkzaamheden, zoals:
                        <ol>
                            <li>wijzigen geslacht</li>
                            <li>wijzigen vader/moeder</li>
                            <li>wijzigen geboortedatum/jaar en/of worpgrootte</li>
                            <li>herstellen van foutieve afvoeren/doodmeldingen</li>
                            <li>omnummeringen</li>
                        </ol>
                    </li>
                </ul>
            </div>
        </div>
    </div>;
}
