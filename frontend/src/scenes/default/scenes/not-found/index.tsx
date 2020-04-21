import * as React from "react";

import * as styles from "./index.css";

export function NotFoundScene() {
    /*if (process.env.SSR) {
        require("../../../../index.server.status").IS_404 = true;
    }*/

    return <p>
        De opgegeven pagina kan niet worden gevonden.
    </p>;
}