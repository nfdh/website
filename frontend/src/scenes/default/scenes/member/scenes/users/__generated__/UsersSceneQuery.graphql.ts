/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type UsersSceneQueryVariables = {
    searchTerm?: string | null;
};
export type UsersSceneQueryResponse = {
    readonly users: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly name: string;
                readonly email: string;
            } | null;
        } | null> | null;
    } | null;
};
export type UsersSceneQuery = {
    readonly response: UsersSceneQueryResponse;
    readonly variables: UsersSceneQueryVariables;
};



/*
query UsersSceneQuery(
  $searchTerm: String
) {
  users(searchTerm: $searchTerm, first: 15) {
    edges {
      node {
        id
        name
        email
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "searchTerm",
    "type": "String"
  }
],
v1 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v2 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "UsersEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cursor",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "PageInfo",
    "kind": "LinkedField",
    "name": "pageInfo",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endCursor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "hasNextPage",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 15
  },
  (v1/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UsersSceneQuery",
    "selections": [
      {
        "alias": "users",
        "args": [
          (v1/*: any*/)
        ],
        "concreteType": "UsersConnection",
        "kind": "LinkedField",
        "name": "__UsersScene_users_connection",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UsersSceneQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "UsersConnection",
        "kind": "LinkedField",
        "name": "users",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "filters": [
          "searchTerm"
        ],
        "handle": "connection",
        "key": "UsersScene_users",
        "kind": "LinkedHandle",
        "name": "users"
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "users"
          ]
        }
      ]
    },
    "name": "UsersSceneQuery",
    "operationKind": "query",
    "text": "query UsersSceneQuery(\n  $searchTerm: String\n) {\n  users(searchTerm: $searchTerm, first: 15) {\n    edges {\n      node {\n        id\n        name\n        email\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '6d5ed8a5ca88881f227ff64112a67980';
export default node;
