/* tslint:disable */
/* eslint-disable */

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
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "logout",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LogoutMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LogoutMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "LogoutMutation",
    "operationKind": "mutation",
    "text": "mutation LogoutMutation {\n  logout\n}\n"
  }
};
})();
(node as any).hash = '301028ecf84321ee3698ebac206d1dff';
export default node;
