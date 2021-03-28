/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AuthServiceQueryVariables = {};
export type AuthServiceQueryResponse = {
    readonly viewer: {
        readonly user: {
            readonly name: string;
            readonly role_website_contributor: boolean;
            readonly role_studbook_administrator: boolean;
            readonly role_studbook_inspector: boolean;
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
      role_website_contributor
      role_studbook_administrator
      role_studbook_inspector
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
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role_website_contributor",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role_studbook_administrator",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role_studbook_inspector",
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
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/)
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
              (v2/*: any*/),
              (v3/*: any*/),
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
    "cacheID": "828b50903e10c979fc5a8bcb3327df25",
    "id": null,
    "metadata": {},
    "name": "AuthServiceQuery",
    "operationKind": "query",
    "text": "query AuthServiceQuery {\n  viewer {\n    user {\n      name\n      role_website_contributor\n      role_studbook_administrator\n      role_studbook_inspector\n      id\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '2d203a3fd5defce7bbfe0a1b06521622';
export default node;
