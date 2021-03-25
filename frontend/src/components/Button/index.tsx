import * as React from "react";
import classnames from "classnames";

import styles from "./index.css";

export enum ButtonVariant {
    Default,
    Primary
}

export type ButtonProps = BaseButtonProps & (NormalButtonProps | AnchorButtonProps);

export interface BaseButtonProps {
    danger?: boolean,
	onClick: (evt: React.MouseEvent<HTMLButtonElement>, eventData?: any) => void,
	eventData?: any
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
    const { children, className, variant, danger, onClick, eventData, type, ...otherProps } = props;

	const onClickHandler = React.useMemo(function() {
		if(onClick === undefined || eventData === undefined) {
			return onClick;
		}
		return function(evt: any) {
			return onClick(evt, eventData); 
		};
	}, [onClick, eventData]);

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
        return <a className={elementClass} onMouseDown={doNotFocusOnMouseDown} onClick={onClickHandler} {...otherProps}>{children}</a>;
    }
    else {
		let defaultedType = type;
		if(defaultedType === undefined) {
			if(onClick !== undefined) defaultedType = "button";
		}

        return <button type={defaultedType} className={elementClass} onMouseDown={doNotFocusOnMouseDown} onClick={onClickHandler} {...otherProps}>{children}</button>;
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
