import * as React from "react";
import classnames from "classnames";

import styles from "./index.css";

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {

    label?: string;
    labelClassName?: string;
    intermediate?: boolean
}

function doNotPropagate(evt: React.SyntheticEvent) {
    evt.stopPropagation();
}

function doNotFocusOnMouseDown(evt: React.MouseEvent) {
    evt.preventDefault();
}

export function Checkbox(props: CheckboxProps) {
    const { label, labelClassName, className, intermediate, ...otherProps } = props;

    return <label className={classnames(styles.label, labelClassName)}>
        <span className={styles.checkbox}>
            <input type="checkbox" className={classnames(styles.input, className)} onMouseDown={doNotFocusOnMouseDown} onClick={doNotPropagate} {...otherProps} />
            <span className={classnames(styles.checkboxInner, intermediate ? styles.intermediate : null)}></span>
            <div className={styles.checkRipple}></div>
        </span>
        {props.label !== undefined
            ? (<span className={styles.labelText}>
                {props.label}
            </span>)
            : null
        }
    </label>
}