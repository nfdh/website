/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type FailedSendDekverklaringReason = "UNKNOWN" | "%future added value";
export type Studbook = "DRENTS_HEIDESCHAAP" | "SCHOONEBEEKER" | "%future added value";
export type DekverklaringInput = {
    season: number;
    studbook: Studbook;
    name: string;
    kovo: number;
    koe: number;
    kool: number;
    korl: number;
    dekgroepen: Array<DekgroepInput>;
    remarks: string;
};
export type DekgroepInput = {
    ewe_count: number;
    rammen: Array<string>;
};
export type SendDekverklaringMutationVariables = {
    dekverklaring: DekverklaringInput;
};
export type SendDekverklaringMutationResponse = {
    readonly sendDekverklaring: {
        readonly dekverklaring?: {
            readonly id: string;
            readonly season: number;
            readonly studbook: Studbook;
            readonly date_sent: unknown;
            readonly date_corrected: unknown | null;
        } | null;
        readonly reason?: FailedSendDekverklaringReason | null;
    } | null;
};
export type SendDekverklaringMutation = {
    readonly response: SendDekverklaringMutationResponse;
    readonly variables: SendDekverklaringMutationVariables;
};



/*
mutation SendDekverklaringMutation(
  $dekverklaring: DekverklaringInput!
) {
  sendDekverklaring(dekverklaring: $dekverklaring) {
    __typename
    ... on SuccessSendDekverklaringResult {
      dekverklaring {
        id
        season
        studbook
        date_sent
        date_corrected
      }
    }
    ... on FailedSendDekverklaringResult {
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
    "name": "dekverklaring"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "dekverklaring",
    "variableName": "dekverklaring"
  }
],
v2 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Dekverklaring",
      "kind": "LinkedField",
      "name": "dekverklaring",
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "SuccessSendDekverklaringResult",
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
  "type": "FailedSendDekverklaringResult",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SendDekverklaringMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "sendDekverklaring",
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
    "name": "SendDekverklaringMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "sendDekverklaring",
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
    "cacheID": "7bcf8c7aed17f812617d7471c21b7cec",
    "id": null,
    "metadata": {},
    "name": "SendDekverklaringMutation",
    "operationKind": "mutation",
    "text": "mutation SendDekverklaringMutation(\n  $dekverklaring: DekverklaringInput!\n) {\n  sendDekverklaring(dekverklaring: $dekverklaring) {\n    __typename\n    ... on SuccessSendDekverklaringResult {\n      dekverklaring {\n        id\n        season\n        studbook\n        date_sent\n        date_corrected\n      }\n    }\n    ... on FailedSendDekverklaringResult {\n      reason\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'bb2e5c0d6e5249325e6ae697253b5e76';
export default node;
