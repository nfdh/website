import * as React from "react";

import classnames from "classnames";

export interface IconProps {
    children: string;
    className?: string;
}

export function Icon(props: IconProps) {
    return <i className={classnames("material-icons", props.className)}>{props.children}</i>;
}