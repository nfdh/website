import * as React from "react";
import classnames from "classnames";

import styles from "./index.css";

export interface RowProps {
    className?: string;
    label?: string;
    htmlFor?: string;
    fullWidth?: boolean;
    children: React.ReactNode;
}

export function Row(props: RowProps) {
    return <div className={classnames(styles.row, props.className)}>
        {props.fullWidth !== true ? <label className={styles.label} htmlFor={props.htmlFor}>{props.label}</label> : null}
        <div className={styles.inputContainer}>
            {props.children}
        </div>
    </div>;
}