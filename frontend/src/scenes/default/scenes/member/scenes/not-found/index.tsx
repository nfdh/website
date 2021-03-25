import * as React from "react";
import { useLocation } from "react-router";

import styles from "./index.css";

export function NotFoundScene() {
    if (process.env.SSR) {
        require("../../../../../../index.server").CurrentRequestInfo.statusCode = 404;
    }

    const loc = useLocation();

    return <div className={styles.center}>
        <h2>404. Pagina niet gevonden</h2>
        De opgegeven pagina '{loc.pathname}' kan niet worden gevonden.
    </div>;
}
