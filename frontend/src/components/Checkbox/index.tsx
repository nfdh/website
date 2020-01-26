import * as React from "react";
import classnames from "classnames";

import * as styles from "./index.css";

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {

    label: string;
    labelClassName: string;
}

export function Checkbox(props: CheckboxProps) {
    const { label, labelClassName, className, ...otherProps } = props;

    return <label className={classnames(styles.label, labelClassName)}>
        <span className={styles.checkbox}>
            <input type="checkbox" className={classnames(styles.input, className)} {...otherProps} />
            <span className={styles.checkboxInner}></span>
            <div className={styles.checkRipple}></div>
        </span>
        <span className={styles.labelText}>
            {props.label}
        </span>
    </label>
}