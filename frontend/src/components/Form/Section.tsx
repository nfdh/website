import  * as React from "react";

import styles from "./index.css";

export interface SectionProps {
    title: string,
    children: React.ReactNode
}

export function Section(props: SectionProps) {
    return <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{props.title}</h3>
        {props.children}
    </div>;
}