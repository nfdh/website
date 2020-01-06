import * as React from "react";
import { RouteComponentProps } from "react-router";

import * as styles from "./index.css";

interface NotFoundSceneProps {
    staticContext: any;
}

export function NotFoundScene(props: NotFoundSceneProps) {
    if (props.staticContext) {
        props.staticContext.statusCode = 404;
    }

    return <p>
        De opgegeven pagina kan niet worden gevonden.
    </p>;
}