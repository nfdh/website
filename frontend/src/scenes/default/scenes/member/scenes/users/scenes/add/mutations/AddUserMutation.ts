import { Environment, commitMutation, graphql } from "react-relay";
import { AddUserMutation, UserInput } from "./__generated__/AddUserMutation.graphql";
import { PayloadError } from "relay-runtime";

export { FailedAddUserReason } from "./__generated__/AddUserMutation.graphql";

export function commitAddUser(
    environment: Environment,
	user: UserInput,
    onError: (error: Error) => void,
    onCompleted: (response: AddUserMutation["response"], errors: ReadonlyArray<PayloadError> | null | undefined) => void,
) {
    return commitMutation<AddUserMutation>(environment, {
        mutation: graphql`
            mutation AddUserMutation($user: UserInput!) {
                addUser(user: $user) {
                    ...on SuccessAddUserResult {
                        user {
                            id
                        }
                    }
                    ...on FailedAddUserResult {
                        reason
                    }
                }
            }
        `,
        variables: {
        	user: user
        },
        onError: onError,
        onCompleted: onCompleted,
    });
}
