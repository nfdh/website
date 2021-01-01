import * as React from "react";
import classnames from "classnames";

import * as styles from "./index.css";

export interface RadioProps
    extends React.InputHTMLAttributes<HTMLInputElement> {

    label?: string;
    labelClassName?: string;
}

function doNotPropagate(evt: React.SyntheticEvent) {
    evt.stopPropagation();
}

function doNotFocusOnMouseDown(evt: React.MouseEvent) {
    evt.preventDefault();
}

export function Radio(props: RadioProps) {
    const { label, labelClassName, className, ...otherProps } = props;

    return <label className={classnames(styles.label, labelClassName)}>
        <span className={styles.checkbox}>
            <input type="radio" className={classnames(styles.input, className)} onMouseDown={doNotFocusOnMouseDown} onClick={doNotPropagate} {...otherProps} />
            <span className={styles.checkboxInner}></span>
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