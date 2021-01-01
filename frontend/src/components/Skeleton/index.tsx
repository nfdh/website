import * as React from "react";

import * as styles from "./index.css";

export interface SkeletonLineProps {

}

export function SkeletonLine(props: SkeletonLineProps) {
    return <div className={styles.line}></div>
}