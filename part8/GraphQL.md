# GraphQL

Whereas REST is resource based, all resources have their own endpoint, Graph lets the browser form a query. There is a single GraphQL endpoint which takes the query and fulfills it. The query's structure is similar to that of the returned data in JSON format. 

## [Schemas](https://graphql.org/learn/schema)
Schemas consist of `type`'s, structured like objects with key-value pairs where the values are other types. Graph recognises scalar types such as `String`, `Int`, `Float`, `Boolean` and `ID` (non-human-readable unique string), or you can define a custom type with the `scalar` keyword. 

