/* tslint:disable */
/* eslint-disable */
/* @relayHash e53bfc1392482f057a630739fe57c8c4 */

import { ConcreteRequest } from "relay-runtime";
export type LogoutMutationVariables = {};
export type LogoutMutationResponse = {
    readonly logout: boolean | null;
};
export type LogoutMutation = {
    readonly response: LogoutMutationResponse;
    readonly variables: LogoutMutationVariables;
};



/*
mutation LogoutMutation {
  logout
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "logout",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "LogoutMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "LogoutMutation",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "LogoutMutation",
    "id": null,
    "text": "mutation LogoutMutation {\n  logout\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '301028ecf84321ee3698ebac206d1dff';
export default node;
