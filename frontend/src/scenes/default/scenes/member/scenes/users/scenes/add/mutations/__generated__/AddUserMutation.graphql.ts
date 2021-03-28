/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type FailedAddUserReason = "EMAIL_IN_USE" | "UNAUTHORIZED" | "UNKNOWN" | "%future added value";
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
export type AddUserMutationVariables = {
    user: UserInput;
};
export type AddUserMutationResponse = {
    readonly addUser: {
        readonly user?: {
            readonly id: string;
        } | null;
        readonly reason?: FailedAddUserReason | null;
    } | null;
};
export type AddUserMutation = {
    readonly response: AddUserMutationResponse;
    readonly variables: AddUserMutationVariables;
};



/*
mutation AddUserMutation(
  $user: UserInput!
) {
  addUser(user: $user) {
    __typename
    ... on SuccessAddUserResult {
      user {
        id
      }
    }
    ... on FailedAddUserResult {
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
    "name": "user"
  }
],
v1 = [
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
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "user",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "SuccessAddUserResult",
  "abstractKey": null
},
v3 = {
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
  "type": "FailedAddUserResult",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddUserMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "addUser",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
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
    "name": "AddUserMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "addUser",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d6309bda36f3a07414b6b343abea7dfc",
    "id": null,
    "metadata": {},
    "name": "AddUserMutation",
    "operationKind": "mutation",
    "text": "mutation AddUserMutation(\n  $user: UserInput!\n) {\n  addUser(user: $user) {\n    __typename\n    ... on SuccessAddUserResult {\n      user {\n        id\n      }\n    }\n    ... on FailedAddUserResult {\n      reason\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '3dc2e7ac219326dcf9bf12f36a0eb095';
export default node;
