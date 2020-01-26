import * as React from "react";
import classnames from "classnames";

import * as styles from "./index.css";

export type ButtonVariant = "primary" | "default";

export type ButtonProps = NormalButtonProps | AnchorButtonProps;

export interface NormalButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {

    variant?: ButtonVariant
}

export interface AnchorButtonProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {

    variant?: ButtonVariant;
    href: string;
}

export function Button(props: ButtonProps) {
    const { children, className, variant, ...otherProps } = props;

    let variantStyle: string;
    switch(props.variant) {
        case undefined:
        case "default":
            variantStyle = styles.defaultStyle;
            break;

        case "primary":
            variantStyle = styles.primaryStyle;
            break;

        default:
            throw new Error(`Unkonwn variant '${props.variant}' specified.`);
    }

    if("href" in otherProps) {
        return <a className={classnames(className, styles.button, variantStyle)} {...otherProps}>{children}</a>;
    }
    else {
        return <button className={classnames(className, styles.button, variantStyle)} {...otherProps}>{children}</button>;
    }
}

export interface ButtonGroupProps {
    className?: string;
    children: React.ReactNode
}

export function ButtonGroup(props: ButtonGroupProps) {
    return <div className={classnames(props.className, styles.buttonGroup)}>
        {props.children}
    </div>;
}