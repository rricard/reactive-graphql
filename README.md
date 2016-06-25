# <img alt="Reactive GraphQL Logo" src="./logo/apple-touch-icon.png" width="48px" /> Reactive GraphQL

A set of packages to make your [GraphQL](http://graphql.org/) schemas more
reactive.

---

Reactive GraphQL is broke down into multiple packages currently:

First, we'll only consider the **main packages**:

- `reactive-graphql-server` - A websocket server for GraphQL
- `reactive-graphql-client` - A websocket client to receive GraphQL events

Those packages are used to maintain a live web socket between the GraphQL
schema and a GraphQL client.

Then, we'll see packages made to make the implementation of Reactive GraphQL
more easier:

- `reactive-graphql-tools` - A set of utilities to create easily Reactive
  GraphQL schemas
- `reactive-apollo-client` - An utility to bind Reactive GraphQL to the
  [Apollo](http://www.apollostack.com/) store
- `reactive-relay-client` - _coming soon!_ - An utility to bind Reactive GraphQL
  to the [Relay](https://facebook.github.io/relay/) store

All of those subpackages are managed by [Lerna](https://lernajs.io/).

---

## References

- [Laney Kuenzel & Lee Byron - GraphQL Future at react-europe 2016](
https://www.youtube.com/watch?v=ViXL0YQnioU)
- [New features in GraphQL: Batch, defer, stream, live, and subscribe](
https://medium.com/apollo-stack/new-features-in-graphql-batch-defer-stream-live-and-subscribe-7585d0c28b07#.ibj4lubdn)
