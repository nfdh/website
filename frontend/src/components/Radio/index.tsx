import * as React from "react";
import classnames from "classnames";

import styles from "./index.css";

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

export const Radio = React.forwardRef(function(props: RadioProps, ref: React.Ref<HTMLInputElement>) {
    const { label, labelClassName, className, ...otherProps } = props;

    return <label className={classnames(styles.label, labelClassName)}>
        <span className={styles.checkbox}>
            <input type="radio" className={classnames(styles.input, className)} onMouseDown={doNotFocusOnMouseDown} onClick={doNotPropagate} ref={ref} {...otherProps} />
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
});
