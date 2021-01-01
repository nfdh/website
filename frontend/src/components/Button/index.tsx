import * as React from "react";
import classnames from "classnames";

import * as styles from "./index.css";

export enum ButtonVariant {
    Default,
    Primary
}

export type ButtonProps = BaseButtonProps & (NormalButtonProps | AnchorButtonProps);

export interface BaseButtonProps {
    danger?: boolean
}

export interface NormalButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {

    variant?: ButtonVariant
}

export interface AnchorButtonProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {

    variant?: ButtonVariant;
    href: string;
}

function doNotFocusOnMouseDown(evt: React.MouseEvent) {
    evt.preventDefault();
}

export function Button(props: ButtonProps) {
    const { children, className, variant, danger, ...otherProps } = props;

    let variantStyle: string;
    switch(variant) {
        case undefined:
        case ButtonVariant.Default:
            variantStyle = styles.defaultStyle;
            break;

        case ButtonVariant.Primary:
            variantStyle = styles.primaryStyle;
            break;

        default:
            throw new Error(`Unkonwn variant '${props.variant}' specified.`);
    }

    const elementClass = classnames(className, styles.button, variantStyle, danger && styles.danger);

    if("href" in otherProps) {
        return <a className={elementClass} onMouseDown={doNotFocusOnMouseDown} {...otherProps}>{children}</a>;
    }
    else {
        return <button className={elementClass} onMouseDown={doNotFocusOnMouseDown} {...otherProps}>{children}</button>;
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