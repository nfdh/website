import * as React from "react";
import classnames from "classnames";
import { Location } from "history";
import { NavLink } from "react-router-dom";

import * as styles from "./index.css";

export interface VerticalMenuProps {
    children: React.ReactNode,
    className?: string
}

export function VerticalMenu(props: VerticalMenuProps) {
   return <div className={classnames(styles.container, props.className)}>
       {props.children}
   </div>
}

export interface VerticalMenuGroupProps {
    title: React.ReactNode,
    children: React.ReactNode
}

export function VerticalMenuGroup(props: VerticalMenuGroupProps) {
    return <div className={styles.group}>
        <h4 className={styles.groupTitle}>{props.title}</h4>
        <div className={styles.groupContent}>
            {props.children}
        </div>
    </div>;
}

export interface VerticalMenuItemProps {
    children: React.ReactNode,
    to: Location | string,
	end?: bool
}

export function VerticalMenuItem(props: VerticalMenuItemProps) {
    return <NavLink to={props.to} className={styles.item} activeClassName={styles.active} end={props.end}>{props.children}</NavLink>
}
