# Network Layer

The network layer is the interface used by the client to connect to a reactive
schema.

## Default Network Layer

Until now, we only used this default network layer that just accepts a websocket
address:

```js
import {ReactiveNetworkLayer} from 'reactive-graphql-client'
const reactiveNetworkLayer = new ReactiveNetworkLayer('ws://localhost/graphql')
```

- `ReactiveNetworkLayer` - A default reactive network layer
  - `constructor(urlConfigOrSource: mixed)` - Creates a new network layer
    from a websocket address or configuration object supported by
    [`Rx.Observable.webSocket`](
http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-webSocket)

## Interface `IReactiveNetworkLayer`

Implement this interface in order to be able to receive events from a reactive
schema:

- `IReactiveNetworkLayer` - Interface to connect to a reactive schema
  - `observable(): Rx.Observable<SchemaUpdate>` - An observable emitting
    schema updates
  - `connectionId(): Promise<string>` - An unique identifier for the
    websocket connection that will be sent alongside the synchronous GraphQL
    query for updating later

## Type `SchemaUpdate`

This type sends events to update a synchronous request, for example, a `@live`
or `@defer` directive could send:

```json
{
  "path": ["ROOT_QUERY", "feed", "stories", 0, "comments"],
  "data": [
    {
      "author": {"name": "Robin Ricard"},
      "message": "Reactive GraphQL rocks!"
    }
  ]
}
```

Or a subscription could send:

```json
{
  "path": ["ROOT_SUBSCRIPTION", "likeCount"],
  "data": {
    "likeCount": 5
  }
}
```

- `SchemaUpdate` - Represents an update to a query
  - `path: Array<string>` - Represents the position in the client store of
    the element updated
  - `data: mixed` - The data to push at this path


## References

- [Laney Kuenzel & Lee Byron - GraphQL Future at react-europe 2016](
  https://www.youtube.com/watch?v=ViXL0YQnioU)
- [`Rx.Observable.webSocket`](
  http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-webSocket)
