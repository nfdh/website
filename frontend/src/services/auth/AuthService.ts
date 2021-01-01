import * as React from "react";
import { commitLogin } from "./mutations/LoginMutation";
import { commitLogout } from "./mutations/LogoutMutation";
import { Environment, graphql } from "relay-runtime";
import { useLazyLoadQuery } from "react-relay/hooks"; 
import { AuthServiceQuery } from "./__generated__/AuthServiceQuery.graphql";
import { LoginMutation } from "./mutations/__generated__/LoginMutation.graphql";

export function useUserInfo(): AuthServiceQuery["response"]["viewer"]["user"] {
    const data = useLazyLoadQuery<AuthServiceQuery>(graphql`
        query AuthServiceQuery {
            viewer {
                user {
                    email
                    role
                }
            }
        }
    `, {});

    return data.viewer.user;
}

export interface SuccessLoginResult {
    success: true,
    user: AuthServiceQuery["response"]["viewer"]["user"]
}

export interface FailedLoginResult {
    success: false,
    reason: LoginMutation["response"]["login"]["reason"]
}

export type LoginResult = SuccessLoginResult | FailedLoginResult;

export function login(environment: Environment, username: string, password: string): Promise<LoginResult> {
    return new Promise(function(resolve, reject) {
        commitLogin(environment, username, password, 
            (e) => {
                reject(e);
            },
            (response, e) => {
                if (response.login.user) {
                    resolve({
                        success: true,
                        user: response.login.user
                    });
                }
                else {
                    resolve({
                        success: false,
                        reason: response.login.reason
                    })
                }
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
