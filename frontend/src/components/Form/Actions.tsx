import * as React from "react";

import styles from "./index.css";

export interface ActionsProps {
    children: React.ReactNode;
}

export function Actions(props: ActionsProps) {
    return <div className={styles.actions}>
        {props.children}
    </div>;
}