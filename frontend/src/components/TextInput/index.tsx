import * as React from "react";
import classnames from "classnames";

import { Icon } from "../Icon";
import { Input, InputProps, TextArea as FormulizerTextArea, TextAreaProps as FormulizerTextAreaProps } from "formulizer";

import styles from "./index.css";

export interface TextInputProps
    extends InputProps {

    inputClassName?: string;
    icon?: string;
}

export const TextInput = React.forwardRef(function(props: TextInputProps, ref: React.Ref<HTMLInputElement>) {
    const { className, inputClassName, name, ...otherProps } = props;

	let inner;
	if(name) {
		inner = <Input ref={ref} name={name} className={classnames(inputClassName, styles.input)} {...otherProps} />;
	}
	else {
		inner = <input ref={ref} className={classnames(inputClassName, styles.input)} {...otherProps} />
	}

    return <div className={classnames(className, styles.inputContainer)}>
        {props.icon ? <div className={styles.iconContainer}><Icon>{props.icon}</Icon></div> : null}
		{inner}
    </div>;
});

export interface TextAreaProps
	extends FormulizerTextAreaProps {

	textareaClassName?: string;
}

export const TextArea = React.forwardRef(function(props: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) {
	const { className, textareaClassName, name, ...otherProps } = props;

	let inner;
	if(name) {
		inner = <FormulizerTextArea ref={ref} name={name} className={classnames(textareaClassName, styles.textarea)} {...otherProps}></FormulizerTextArea>;
	}
	else {
		inner = <textarea ref={ref} className={classnames(textareaClassName, styles.textarea)} {...otherProps}></textarea>;
	}

	return <div className={classnames(className, styles.textareaContainer)}>
		{inner}
	</div>;
});
