import * as React from 'react';
import classnames from 'classnames';

import styles from "./index.css";

export interface ModalProps {
    open: boolean;
    children: React.ReactNode
}

let numOpenModals = 0;

export function Modal(props: ModalProps) {
    React.useEffect(function() {
        if(props.open) {
            numOpenModals++;
        
            return function() {
                numOpenModals--;
            };
        }
    }, [props.open]);

    return <div className={styles.container}>
        <div className={classnames(styles.backdrop, props.open && styles.open)}></div>
        <div className={classnames(styles.modal, props.open && styles.open)}>
            {props.children}
        </div>
    </div>;
}

export interface ModalHeaderProps {
    title: string
}

export function ModalHeader(props: ModalHeaderProps) {
    return <div className={styles.header}>
        <h2 className={styles.title}>{props.title}</h2>
    </div>;
}

export interface ModalBodyProps {
    children: React.ReactNode
}

export function ModalBody(props: ModalBodyProps) {
    return <div className={styles.body}>
        {props.children}
    </div>;
}

export interface ModalFooterProps {
    children: React.ReactNode
}

export function ModalFooter(props: ModalFooterProps) {
    return <div className={styles.footer}>
        {props.children}
    </div>;
}