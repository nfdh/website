import * as React from "react";

import * as styles from "./index.css";

export function ContactScene() {

    return <div className={styles.center}>
        <h1>Contact</h1>
        <h3>Secretaris</h3>
        <p>
            Voor al uw vragen en opmerkingen over Drentse Heideschapen, Schoonebeekers en de vereniging kunt u contact opnemen met de secretaris van de NFDH:
        </p>
        <table className={styles.contactInfo}>
            <tbody>
                <tr>
                    <td>Ten name van</td>
                    <td>Marlaine de Munck</td>
                </tr>
                <tr>
                    <td>Adres</td>
                    <td>
                        Hoofdweg 16<br />
                    	4411 AR Rilland
                    </td>
                </tr>
                <tr>
                    <td>Telefoon</td>
                    <td>
                        <a href="tel:06-37382955" target="_blank">06-37382955</a>
                    </td>
                </tr>
                <tr>
                    <td>E-mail</td>
                    <td><a href="mailto:info@nfdh.nl" target="_blank">info@nfdh.nl</a></td>
                </tr>
            </tbody>
        </table>

        <h3>Website beheerder</h3>
        <p>
            Voor vragen met betrekking tot de website kunt u terecht bij de beheerder van deze website
        </p>
        <table className={styles.contactInfo}>
            <tbody>
                <tr>
                    <td>Ten name van</td>
                    <td>Jan Emmens</td>
                </tr>
                <tr>
                    <td>E-mail</td>
                    <td><a href="mailto:website@nfdh.nl" target="_blank">website@nfdh.nl</a></td>
                </tr>
            </tbody>
        </table>
    </div>
}
