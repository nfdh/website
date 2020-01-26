import * as React from "react";
import classnames from "classnames";

import * as styles from "./index.css";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    const { className, ...otherProps } = props;

    return <input className={classnames(className, styles.input)} {...otherProps} />
}