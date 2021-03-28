/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type FailedUpdateUserReason = "EMAIL_IN_USE" | "UNAUTHORIZED" | "UNKNOWN" | "%future added value";
export type UserInput = {
    email: string;
    name: string;
    studbook_heideschaap?: StudbookMembershipInput | null;
    studbook_schoonebeeker?: StudbookMembershipInput | null;
    role_website_contributor: boolean;
    role_studbook_administrator: boolean;
    role_studbook_inspector: boolean;
};
export type StudbookMembershipInput = {
    ko: boolean;
};
export type UpdateUserMutationVariables = {
    id: string;
    user: UserInput;
};
export type UpdateUserMutationResponse = {
    readonly updateUser: {
        readonly reason?: FailedUpdateUserReason | null;
    } | null;
};
export type UpdateUserMutation = {
    readonly response: UpdateUserMutationResponse;
    readonly variables: UpdateUserMutationVariables;
};



/*
mutation UpdateUserMutation(
  $id: ID!
  $user: UserInput!
) {
  updateUser(id: $id, user: $user) {
    __typename
    ... on FailedUpdateUserResult {
      reason
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "user"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  },
  {
    "kind": "Variable",
    "name": "user",
    "variableName": "user"
  }
],
v2 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "reason",
      "storageKey": null
    }
  ],
  "type": "FailedUpdateUserResult",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateUserMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateUser",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateUserMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateUser",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "149203cb066474e90a68c628af0f917d",
    "id": null,
    "metadata": {},
    "name": "UpdateUserMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateUserMutation(\n  $id: ID!\n  $user: UserInput!\n) {\n  updateUser(id: $id, user: $user) {\n    __typename\n    ... on FailedUpdateUserResult {\n      reason\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'e204b04f9904568f3e875472187a399b';
export default node;
