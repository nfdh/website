import * as React from "react";
import classnames from "classnames";

import { Icon } from "../Icon";

import * as styles from "./index.css";

export interface TextInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {

    inputClassName?: string;
    icon?: string;
}

export const TextInput = React.forwardRef(function(props: TextInputProps, ref: React.Ref<HTMLInputElement>) {
    const { className, inputClassName, ...otherProps } = props;

    return <div className={classnames(className, styles.container)}>
        {props.icon ? <div className={styles.iconContainer}><Icon>{props.icon}</Icon></div> : null}

        <input ref={ref} className={classnames(inputClassName, styles.input)} {...otherProps} />
    </div>;
});