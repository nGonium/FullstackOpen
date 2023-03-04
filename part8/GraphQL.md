# GraphQL

GraphQL is a way to communicate with a server API. Whereas REST is resource based, all resources have their own endpoint, Graph lets the browser form a query instead. There is a single GraphQL endpoint which takes the query and fulfills it. This prevents underfetching/overfetching that would be more common in REST.

## [Schemas](https://graphql.org/learn/schema)

The backbone of GraphQL is the schema, which defines types (structure of entities), queries and mutations. Graph recognises scalar types such as `String`, `Int`, `Float`, `Boolean` and `ID` (non-human-readable unique string), or you can define a custom type with the `scalar` keyword. Other types you will create are structured like objects. Note, types followed by a `!` are non-nullable, all others may be `null` or the type. Arrays of a type are indicated by `[]`.

Queries describe which fields can be fetched when a query is made, whereas mutations describe which fields can be mutated, as well as the data returned.

## Resolvers

Graph schemas do not have to match the structure of data in the database, they may omit fields, rename fields or add new fields. You can supply resolvers for each field: functions which

# React

Run `npm i @apollo/client` to install apollo client, then setup an apollo client and provider as follows.

```js
import ReactDOM from 'react-dom/client';
import App from './App';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
```

## Query and mutation

As previous, use the `gql` directive followed by a template literal to construct a query. Then use the `useQuery` hook on it, which returns an object with the fields `error`, `data`, and the boolean `loading`.

`useQuery` is run every time the component is rendered, but we can specify a `skip` option which, when true, skips the query. We can pass in variables through the `variables` option, the name of the variable must correspond with the GraphQL variable.

Similarly, we can use the `useMutation` hook, but note this returns an array not an object as `useQuery`. The first element is the associated function.

## Cache

The apolloclient takes a `cache` option. If set, queries which are the same will have their results pulled from the cache, if available, avoiding calls to the server.

Apollo does not automatically invalidate cache, e.g. on mutations\*. We can direct apollo to refetch with the `refetchQueries` option on `useMutation`, which takes an array of directive objects. Each directive has the field `query`, specifying which query should be refetched. However, this means only the changes made by that user through that mutation will invalidate cache.

Alternatively we can set a query to poll at a set interval by setting the `pollInterval` option in `useQuery` (in _ms_).

The cache may further be used to save the local application state, potentially making other libraries like Redux redundant in some applications.

\*There is an exception where Apollo does "invalidate automatically". If an entity has a set ID (i.e. a field of type `ID`), then when this entity is edited Apollo will be able to refetch the entity.

## Errors

By default, `useMutation` will throw an error if it can not resolve the request. We can catch the error by setting the `onError` option to a function which takes the error. Note the error message is deeply nested

```js
const [createPerson] = useMutation(CREATE_PERSON, {
  refetchQueries: [{ query: ALL_PERSONS }],
  onError: (error) => {
    const errors = error.graphQLErrors[0].extensions.error.errors;
    const messages = Object.values(errors)
      .map((e) => e.message)
      .join('\n');
    setError(messages);
  },
});
```

Note that some requests are valid (Apollo can resolve them without throwing an error) but may return `null` rather than a desired entity. You may wish to display your own error to the user in the event `null` is returned. This can be done in a `useEffect` hook dependent on `results.data`. Note `eslint` may throw a warning which can be suppressed with the `//eslint-disable-line` directive.
