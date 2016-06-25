# Reactive Schemas

This part is about creating GraphQL reactive Schemas.

They are just a standard GraphQL schemas enhanced with [Rx Observables][rx-obs].

There is two main way to create those schemas:

1. Do some [Resolver Wrapping](/docs/reactive-schemas/resolver-wrapping.md), a
  method that can be direclty applied on top of any Schema created using
  [GraphQL JS][gql-js].
2. If you are using [Apollo][apollo]'s [GraphQL Tools][gql-tools], you may want
  to use [Schema Definition Wrapping](
/docs/reactive-schemas/schema-definition-wrapping.md)

[rx-obs]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
[gql-js]: https://github.com/graphql/graphql-js
[apollo]: http://www.apollostack.com/
[gql-tools]: https://github.com/apollostack/graphql-tools
