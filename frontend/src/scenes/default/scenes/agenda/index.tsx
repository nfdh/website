import * as React from "react";
import classnames from "classnames";

import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import { TextInput } from "../../../../components/TextInput";
import { Checkbox } from "../../../../components/Checkbox";
import { Button, ButtonGroup } from "../../../../components/Button";

import styles from "./index.css";
import { button } from "../../../../components/Button/index.css";

interface AgendaSceneProps {

}

export function AgendaScene(props: AgendaSceneProps) {
    const loc = useLocation();
    let year = parseInt(loc.pathname.substr(-4), 10);
    if (isNaN(year)) {
        year = new Date().getFullYear();
    }

    return <div className={styles.center}>
        <div className={styles.pageTitleArea}>
            <h1 className={styles.pageTitle}>Agenda</h1>

            <div className={styles.navigation}>
                <Link to={(year - 1).toString()} className={styles.leftButton}>&lt;</Link>
                <span className={styles.year}>
                    {year}
                </span>
                <Link to={(year + 1).toString()} className={styles.rightButton}>&gt;</Link>
            </div>
        </div>

        <div className={styles.calendar}>
            <div className={classnames(styles.calendarItem, styles.past)}>
                <div className={styles.calendarDate}>
                    30
                    <span>nov</span>
                </div>
                <div className={styles.calendarDesc}>
                    <h3>Najaarsbijeenkomst Leden NFDH</h3>
                    <p>
                        Tijdens deze gezellige bijeenkomst komen we samen bij de kudde van Ruinen. Hier hebben zij recent een nieuwe schaapskooi gebouwd die ze graag aan ons willen laten zien.<br />
                        Leden kunnen zich inschrijven door een e-mail te sturen naar info@nfdh.nl
                        <br />
                        <br />
                        <b>Tijd: </b><br />
                        13:00 - 17:00<br />
                        <br />
                        <b>Locatie: </b><br />
                        Schaapskooi Ruinen<br />
                        Benderse 36<br />
                        7963 RA Ruinen<br />
                        <br />
                        <a href="https://goo.gl/maps/31KyakAPv3xaf1aS8" target="_blank">Open in Google Maps</a>
                    </p>
                </div>
            </div>

            <div className={styles.todayMarker}>
                <div className={styles.todayMarkerText}>Vandaag</div>
                <div className={styles.todayMarkerLine}></div>
            </div>

            <div className={styles.calendarItem}>
                <div className={styles.calendarDate}>
                    4
                    <span>mrt</span>
                </div>
                <div className={styles.calendarDesc}>
                    <h3>Begin keuringsronde Noord-Nederland</h3>
                    <p>
                        Tijdens de jaarlijkse keuringsronde gaan onze keuringsmeesters het land rond om schapen te keuren voor het stamboek.<br />
                        U kunt u schapen ook inschrijven om te laten keuren via het Ledenportaal.
                    </p>
                </div>
            </div>
        </div>
    </div>;
}