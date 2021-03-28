import * as React from "react";

import styles from "./index.css";

export interface SkeletonLineProps {

}

export function SkeletonLine(props: SkeletonLineProps) {
    return <div className={styles.line}></div>
}

export function SkeletonTextInput(props: SkeletonLineProps) {
    return <div className={styles.textInput}></div>
}