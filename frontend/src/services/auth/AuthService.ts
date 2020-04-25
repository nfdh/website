import * as React from "react";
import { commitLogin } from "./mutations/LoginMutation";
import { commitLogout } from "./mutations/LogoutMutation";
import { Environment, graphql } from "relay-runtime";
import { useLazyLoadQuery } from "react-relay/hooks"; 
import { AuthServiceQuery } from "./__generated__/AuthServiceQuery.graphql";

export function useUserInfo(): AuthServiceQuery["response"]["viewer"]["user"] {
    const data = useLazyLoadQuery<AuthServiceQuery>(graphql`
        query AuthServiceQuery {
            viewer {
                user {
                    name
                    role
                }
            }
        }
    `, {});

    return data.viewer.user;
}

export function login(environment: Environment, username: string, password: string): Promise<void> {
    return new Promise(function(resolve, reject) {
        commitLogin(environment, username, password, 
            (e) => {
                reject(e);
            },
            (response, e) => {
                resolve();
            }
        );
    });
}

export function logout(environment: Environment): Promise<void> {
    return new Promise(function(resolve, reject) {
        commitLogout(environment, 
            (e) => {
                reject(e);
            },
            (response, e) => {
                resolve();
            }
        );
    });
}
