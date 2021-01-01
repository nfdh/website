import * as React from "react";
import * as ReactDOM from "react-dom";


export interface PortalProps {
    mounted: boolean,
    className?: string,
    children: React.ReactNode
}

export function Portal(props: PortalProps) {
    const node = React.useRef(undefined);

    if (node.current === undefined) {
        node.current = document.createElement("div");
    }

    React.useLayoutEffect(function() {
        if (props.className) {
            node.current.className = props.className;
        }
    }, [props.className]);

    React.useLayoutEffect(function() {
        if (!props.mounted) {
            return;
        }

        document.body.appendChild(node.current);

        return function() {
            document.body.removeChild(node.current);
        };
    }, [props.mounted]);

    return ReactDOM.createPortal(props.children, node.current);
}