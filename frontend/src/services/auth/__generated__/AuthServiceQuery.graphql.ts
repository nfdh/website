/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type UserRole = "MEMBER" | "%future added value";
export type AuthServiceQueryVariables = {};
export type AuthServiceQueryResponse = {
    readonly viewer: {
        readonly user: {
            readonly email: string;
            readonly role: UserRole;
        } | null;
    };
};
export type AuthServiceQuery = {
    readonly response: AuthServiceQueryResponse;
    readonly variables: AuthServiceQueryVariables;
};



/*
query AuthServiceQuery {
  viewer {
    user {
      email
      role
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AuthServiceQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AuthServiceQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "aba92359872dcf160c5ea4043503f2df",
    "id": null,
    "metadata": {},
    "name": "AuthServiceQuery",
    "operationKind": "query",
    "text": "query AuthServiceQuery {\n  viewer {\n    user {\n      email\n      role\n      id\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '0b65dca316eea36c5e5986016e7be970';
export default node;
