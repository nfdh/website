/* tslint:disable */
/* eslint-disable */
/* @relayHash 4623a66040df581fa6023779c18cb64c */

import { ConcreteRequest } from "relay-runtime";
export type UserRole = "MEMBER" | "%future added value";
export type AuthServiceQueryVariables = {};
export type AuthServiceQueryResponse = {
    readonly viewer: {
        readonly user: {
            readonly name: string;
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
      name
      role
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "role",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AuthServiceQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "user",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AuthServiceQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "user",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "AuthServiceQuery",
    "id": null,
    "text": "query AuthServiceQuery {\n  viewer {\n    user {\n      name\n      role\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '8bf03babe29d62fb560fb43566908381';
export default node;
