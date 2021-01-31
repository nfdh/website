import { Environment, commitMutation, graphql } from "react-relay";
import { SendDekverklaringMutation, DekverklaringInput } from "./__generated__/SendDekverklaringMutation.graphql";
import { PayloadError } from "relay-runtime";

export function commitSendDekverklaring(
    environment: Environment,
    dekverklaring: DekverklaringInput,
    onError: (error: Error) => void,
    onCompleted: (response: SendDekverklaringMutation["response"], errors: ReadonlyArray<PayloadError> | null | undefined) => void,
) {
    return commitMutation<SendDekverklaringMutation>(environment, {
        mutation: graphql`
            mutation SendDekverklaringMutation($dekverklaring: DekverklaringInput!) {
                sendDekverklaring(dekverklaring: $dekverklaring) {                   
                    ...on SuccessSendDekverklaringResult {
						dekverklaring {
							id
							season
							studbook
							date_sent
							date_corrected
						}
					}
					...on FailedSendDekverklaringResult {
                        reason
                    }
                }
            }
        `,
        variables: {
            dekverklaring: dekverklaring
        },
        onError: onError,
        onCompleted: onCompleted,
        updater: function(store, data) {
			// TODO
        }
    });
}
