import * as React from "react";
import { Route, Routes } from "react-router";
import { NavLink, Link } from "react-router-dom";
import { useRelayEnvironment } from "react-relay/hooks";

import { useUserInfo, logout } from "../../services/auth";

import { HomeScene } from "./scenes/home";
import { ContactScene } from "./scenes/contact";
import { DisclaimerScene } from "./scenes/disclaimer";
import { LoginScene } from "./scenes/login";
import { AgendaScene } from "./scenes/agenda";
import { NotFoundScene } from "./scenes/not-found";

import * as styles from "./index.css";
import { MemberScene } from "./scenes/member";

export function DefaultScene() {
    const authenticatedUser = useUserInfo();
    const environment = useRelayEnvironment();

    const onLogoutClick = React.useCallback(function(evt: React.SyntheticEvent) {
        logout(environment);

        evt.preventDefault();
    }, []);

    let memberRoutes;
    if(authenticatedUser === null) {
        memberRoutes = <>
            <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="lid-worden">Lid worden</NavLink>
            <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="login">Inloggen</NavLink>
        </>;
    }
    else {
        memberRoutes = <>
            <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="ledenportaal">Ledenportaal</NavLink>
            <a className={styles.headerMenuLink} onClick={onLogoutClick} href="#">Uitloggen</a>
        </>;
    }

    return <>
        <div className={styles.header}>
            <div className={styles.title}>
                <h1>
                    Nederlandse Fokkersvereniging<br />
                    Het Drentse Heideschaap
                </h1>
                <h2>Drents Heideschaap en Schoonebeeker</h2>
            </div>

            <div className={styles.headerMenu}>
                <div className={styles.headerMenuSegment}>
                    <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="/" end>Home</NavLink>
                    <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="vereniging">Vereniging</NavLink>
                    <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="rassen">Rassen</NavLink>
                    <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="contact">Contact</NavLink>
                </div>
                <div className={styles.headerMenuSegment}>
                    {memberRoutes}
                </div>
            </div>

            <div className={styles.headerFade}></div>
        </div>

        <Routes>
            <Route path="" element={<HomeScene />} />
            <Route path="login/*" element={<LoginScene />} />
            <Route path="disclaimer/*" element={<DisclaimerScene />} />
            <Route path="contact/*" element={<ContactScene />} />
            <Route path="agenda/*" element={<AgendaScene />} />
            <Route path="ledenportaal/*" element={<MemberScene />} />
            
            <Route path="*" element={<NotFoundScene />} />
        </Routes>

        <div className={styles.footer}>
            <div className={styles.footerCenter}>
                <div className={styles.footerColumn}>
                    <h4>Contact</h4>
                    <table>
                        <tbody>
                            <tr>
                                <td><i>Ten name van</i></td>
                                <td>Marlaine de Munck</td>
                            </tr>
                            <tr>
                                <td><i>Adres</i></td>
                                <td>Hoofdweg 16<br />4411 AR Rilland</td>
                            </tr>
                            <tr>
                                <td><i>Telefoon</i></td>
                                <td>06-37382955</td>
                            </tr>
                            <tr>
                                <td><i>Email</i></td>
                                <td><a href="mailto:info@nfdh.nl" target="_blank">info@nfdh.nl</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={styles.footerColumn}>
                    <h4>Legal</h4>
                    <p>
                        <Link to="disclaimer">Disclaimer</Link><br />
                        <a href="">Verenigingstatuut</a>
                    </p>
                    <br />
                    <br />
                    <p className={styles.copyRightNotice}>
                        Copyright &copy; 2020 Nederlandse Fokkersvereniging Het Drentse Heideschaap<br />
                        Website door <a href="https://www.linkedin.com/in/jan-emmens-525029189/" target="_blank">Jan Emmens</a>
                    </p>
                </div>
            </div>
        </div>
    </>;
}
