import * as React from "react";
import { useLocation } from "react-router";

import * as styles from "./index.css";

export function NotFoundScene() {
    if (process.env.SSR) {
        require("../../../../index.server").CurrentRequestInfo.statusCode = 404;
    }

    const loc = useLocation();

    return <div className={styles.center}>
        <h1>Pagina niet gevonden</h1>
        De opgegeven pagina '{loc.pathname}' kan niet worden gevonden.
    </div>;
}