import * as React from "react";
import { useLocation, Redirect } from "react-router";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../../services/auth";
import { useRelayEnvironment } from "react-relay/hooks";

export function LogoutScene(): JSX.Element {
    const environment = useRelayEnvironment();
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(function() {
        logout(environment)
            .then(function(u) {
                navigate(getQueryVariable(location.search, "returnPath") || "/");
            });
    });

    return <>Uitloggen...</>;
}

function getQueryVariable(search: string, variable: string) {
    var query = search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}