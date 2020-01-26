import * as React from "react";

import { TextInput } from "../../../../components/TextInput";
import { Checkbox } from "../../../../components/Checkbox";
import { Button, ButtonGroup } from "../../../../components/Button";

import * as styles from "./index.css";

import YoutubeIcon from "./youtube_icon.png";
import PdfIcon from "./pdf_icon.png";

interface LoginSceneProps {

}

export function LoginScene(props: LoginSceneProps) {
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
                <form className={styles.loginForm}>
                    <TextInput className={styles.usernameInput} type="text" placeholder="Gebruikersnaam" />
                    <TextInput className={styles.passwordInput} type="password" placeholder="Wachtwoord" />
                    <Checkbox labelClassName={styles.stayLoggedInLabel} label="Ingelogd blijven" />
                    <Button variant="primary" className={styles.loginButton} type="submit">Inloggen</Button>
                </form>
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
                    <Button href="https://vnl.falcooonline.com/" target="_blank" variant="primary" className={styles.falcooButton}>Inloggen</Button>
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