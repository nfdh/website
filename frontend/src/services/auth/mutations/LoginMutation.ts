import { Environment, commitMutation, graphql } from "react-relay";
import { LoginMutation } from "./__generated__/LoginMutation.graphql";
import { PayloadError } from "relay-runtime";

export function commitLogin(
    environment: Environment,
    username: string,
    password: string,
    onError: (error: Error) => void,
    onCompleted: (response: LoginMutation["response"], errors: ReadonlyArray<PayloadError> | null | undefined) => void,
) {
    return commitMutation<LoginMutation>(environment, {
        mutation: graphql`
            mutation LoginMutation($username: String!, $password: String!) {
                login(username: $username, password: $password) {
                    token
                    user {
                        id
                        name
                        role
                    }
                }
            }
        `,
        variables: {
            username: username,
            password: password
        },
        onError: onError,
        onCompleted: onCompleted
    });
}