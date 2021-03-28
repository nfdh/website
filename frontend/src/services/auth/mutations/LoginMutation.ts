import { Environment, commitMutation, graphql } from "react-relay";
import { LoginMutation } from "./__generated__/LoginMutation.graphql";
import { PayloadError } from "relay-runtime";

export function commitLogin(
    environment: Environment,
    email: string,
    password: string,
    onError: (error: Error) => void,
    onCompleted: (response: LoginMutation["response"], errors: ReadonlyArray<PayloadError> | null | undefined) => void,
) {
    return commitMutation<LoginMutation>(environment, {
        mutation: graphql`
            mutation LoginMutation($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    ...on SuccessLoginResult {
                        user {
                            name
               				role_website_contributor
							role_studbook_administrator
							role_studbook_inspector
                        }
                    }
                    ...on FailedLoginResult {
                        reason
                    }
                }
            }
        `,
        variables: {
            email: email,
            password: password
        },
        onError: onError,
        onCompleted: onCompleted,
        updater: function(store, data) {
            if (data.login.user) {
                const viewer = store.getRoot().getLinkedRecord("viewer");
                const user = store.getRootField("login").getLinkedRecord("user");
                viewer.setLinkedRecord(user, "user");
            }
        }
    });
}
