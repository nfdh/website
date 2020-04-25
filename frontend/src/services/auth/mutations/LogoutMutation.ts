import { Environment, commitMutation, graphql } from "react-relay";
import { LogoutMutation } from "./__generated__/LogoutMutation.graphql";
import { PayloadError } from "relay-runtime";

export function commitLogout(
    environment: Environment,
    onError: (error: Error) => void,
    onCompleted: (response: LogoutMutation["response"], errors: ReadonlyArray<PayloadError> | null | undefined) => void,
) {
    return commitMutation<LogoutMutation>(environment, {
        mutation: graphql`
            mutation LogoutMutation {
                logout
            }
        `,
        variables: {},
        onError: onError,
        onCompleted: onCompleted
    });
}