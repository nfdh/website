import * as React from "react";
import classnames from "classnames";

import * as styles from "./index.css";

export interface ToolbarProps {
    children: React.ReactNode,
    className?: string
}

export function Toolbar(props: ToolbarProps) {
   return <div className={classnames(styles.container, props.className)}>
       {props.children}
   </div>
}

export interface ToolbarSeparatorProps {

}

export function ToolbarSeparator(props: ToolbarSeparatorProps) {
    return <div className={styles.separator}></div>
}