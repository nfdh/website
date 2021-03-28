/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type EditUserSceneQueryVariables = {
    userId: string;
};
export type EditUserSceneQueryResponse = {
    readonly user: {
        readonly email: string;
        readonly name: string;
        readonly studbook_heideschaap: {
            readonly ko: boolean;
        } | null;
        readonly studbook_schoonebeeker: {
            readonly ko: boolean;
        } | null;
        readonly role_website_contributor: boolean;
        readonly role_studbook_administrator: boolean;
        readonly role_studbook_inspector: boolean;
    } | null;
};
export type EditUserSceneQuery = {
    readonly response: EditUserSceneQueryResponse;
    readonly variables: EditUserSceneQueryVariables;
};



/*
query EditUserSceneQuery(
  $userId: ID!
) {
  user(id: $userId) {
    email
    name
    studbook_heideschaap {
      ko
    }
    studbook_schoonebeeker {
      ko
    }
    role_website_contributor
    role_studbook_administrator
    role_studbook_inspector
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "userId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "ko",
    "storageKey": null
  }
],
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "StudbookMembership",
  "kind": "LinkedField",
  "name": "studbook_heideschaap",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "StudbookMembership",
  "kind": "LinkedField",
  "name": "studbook_schoonebeeker",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role_website_contributor",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role_studbook_administrator",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role_studbook_inspector",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditUserSceneQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditUserSceneQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "355e97541b0dc5605ccbb15c16c42e6d",
    "id": null,
    "metadata": {},
    "name": "EditUserSceneQuery",
    "operationKind": "query",
    "text": "query EditUserSceneQuery(\n  $userId: ID!\n) {\n  user(id: $userId) {\n    email\n    name\n    studbook_heideschaap {\n      ko\n    }\n    studbook_schoonebeeker {\n      ko\n    }\n    role_website_contributor\n    role_studbook_administrator\n    role_studbook_inspector\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = 'a0973a49f99ce4ead22660c53e4ceae8';
export default node;
