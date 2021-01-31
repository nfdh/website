/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type Studbook = "DRENTS_HEIDESCHAAP" | "SCHOONEBEEKER" | "%future added value";
export type FormsSceneQueryVariables = {};
export type FormsSceneQueryResponse = {
    readonly viewer: {
        readonly dekverklaringen: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                    readonly season: number;
                    readonly studbook: Studbook;
                    readonly date_sent: unknown;
                    readonly date_corrected: unknown | null;
                } | null;
            } | null> | null;
        } | null;
    };
};
export type FormsSceneQuery = {
    readonly response: FormsSceneQueryResponse;
    readonly variables: FormsSceneQueryVariables;
};



/*
query FormsSceneQuery {
  viewer {
    dekverklaringen(first: 15) {
      edges {
        node {
          id
          season
          studbook
          date_sent
          date_corrected
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
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "DekverklaringenEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Dekverklaring",
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
            "name": "season",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "studbook",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "date_sent",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "date_corrected",
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
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 15
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "FormsSceneQuery",
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
            "alias": "dekverklaringen",
            "args": null,
            "concreteType": "DekverklaringenConnection",
            "kind": "LinkedField",
            "name": "__FormsScene_dekverklaringen_connection",
            "plural": false,
            "selections": (v0/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FormsSceneQuery",
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
            "args": (v1/*: any*/),
            "concreteType": "DekverklaringenConnection",
            "kind": "LinkedField",
            "name": "dekverklaringen",
            "plural": false,
            "selections": (v0/*: any*/),
            "storageKey": "dekverklaringen(first:15)"
          },
          {
            "alias": null,
            "args": (v1/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "FormsScene_dekverklaringen",
            "kind": "LinkedHandle",
            "name": "dekverklaringen"
          }
        ],
        "storageKey": null
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
            "viewer",
            "dekverklaringen"
          ]
        }
      ]
    },
    "name": "FormsSceneQuery",
    "operationKind": "query",
    "text": "query FormsSceneQuery {\n  viewer {\n    dekverklaringen(first: 15) {\n      edges {\n        node {\n          id\n          season\n          studbook\n          date_sent\n          date_corrected\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '13be3e88fc582d8f16ea8c02da3472be';
export default node;
