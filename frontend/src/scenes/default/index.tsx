import * as React from "react";
import { Redirect, Route, Switch } from "react-router";
import { NavLink, Link } from "react-router-dom";

import { HomeScene } from "./scenes/home";
import { DisclaimerScene } from "./scenes/disclaimer";
import { NotFoundScene } from "./scenes/not-found";

import * as styles from "./index.css";
import { LoginScene } from "./scenes/login";

export function DefaultScene() {
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
                    <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="/home">Home</NavLink>
                    <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="/vereniging">Vereniging</NavLink>
                    <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="/rassen">Rassen</NavLink>
                    <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="/agenda">Agenda</NavLink>
                </div>
                <div className={styles.headerMenuSegment}>
                    <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="/lid-worden">Lid worden</NavLink>
                    <NavLink className={styles.headerMenuLink} activeClassName={styles.active} to="/login">Inloggen</NavLink>
                </div>
            </div>
        </div>

        <Switch>
            <Route path="/home" component={HomeScene} />
            <Route path="/login" component={LoginScene} />
            <Route path="/disclaimer" component={DisclaimerScene} />
            <Redirect path="/" exact to="/home" />
            <Route component={NotFoundScene} />
        </Switch>

        <div className={styles.footer}>
            <div className={styles.footerCenter}>
                <div className={styles.footerColumn}>
                    <h4>Contact</h4>
                    <table>
                        <tbody>
                            <tr>
                                <td><i>Ten name van</i></td>
                                <td>Nicolette Linton</td>
                            </tr>
                            <tr>
                                <td><i>Adres</i></td>
                                <td>Schansweg 39<br />4791 RA Klundert</td>
                            </tr>
                            <tr>
                                <td><i>Telefoon</i></td>
                                <td>0168-401543<br />06-14489596</td>
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
                        <Link to="/disclaimer">Disclaimer</Link><br />
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