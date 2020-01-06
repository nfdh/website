import { Network, RecordSource, Environment, Store  } from "relay-runtime";
  
const source = new RecordSource();
const store = new Store(source);
const network = Network.create(fetchQuery); // see note below

export default new Environment({
    network,
    store,
});

function fetchQuery(
    operation,
    variables,
    cacheConfig,
    uploadables,
  ) {
    return fetch('/graphql', {
      method: 'POST',
      headers: {
        // Add authentication and other headers here
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: operation.text, // GraphQL text from input
        variables,
      }),
    }).then(response => {
      return response.json();
    });
  }