import { Environment, commitMutation, graphql } from "react-relay";
import { UpdateUserMutation, UserInput } from "./__generated__/UpdateUserMutation.graphql";
import { PayloadError } from "relay-runtime";

export { FailedUpdateUserReason } from "./__generated__/UpdateUserMutation.graphql";

export function commitUpdateUser(
    environment: Environment,
    id: string,
	user: UserInput,
    onError: (error: Error) => void,
    onCompleted: (response: UpdateUserMutation["response"], errors: ReadonlyArray<PayloadError> | null | undefined) => void,
) {
    return commitMutation<UpdateUserMutation>(environment, {
        mutation: graphql`
            mutation UpdateUserMutation($id: ID!, $user: UserInput!) {
                updateUser(id: $id, user: $user) {
                    ...on FailedUpdateUserResult {
                        reason
                    }
                }
            }
        `,
        variables: {
            id: id,
        	user: user
        },
        onError: onError,
        onCompleted: onCompleted,
    });
}
