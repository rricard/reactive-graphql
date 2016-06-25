# Resolver wrapping

Instead of directly pushing your resolver logic, you can wrap this logic inside
of a wrapper able to attach an observable to a client socket.

## Wrapping with an observable

Basically, instead of just resolving a promise to the value of the field you
need to also provide a [Rx Observable][rx-obs].

Here is a basic example in which we resolve a simple timestamp:

```js
import * as Rx from 'rxjs'
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt
} from 'graphql'
import {reactiveResolver} from 'reactive-graphql-tools'

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      timestamp: {
        type: GraphQLInt,
        resolve: reactiveResolver({
          resolve: () => Date.now(),
          observe: (resolved) => Rx.Observable.interval(1000)
            .map(tick => resolved + tick * 1000),
        })
      }
    }
  })
})
```

Note that any kind of field can be bound to a Reactive Resolver.

You can find more informations about this in the [advanced section](
../advanced/resolver-wrapping.md#-reactiveresolver).

## Wrapping with a polling resolver

The last example we've seen can be in fact simplified greatly using a wrapper
that will poll the object and emit changes whenever it sees changes:

```js
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt
} from 'graphql'
import {pollingResolver} from 'reactive-graphql-tools'

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      timestamp: {
        type: GraphQLInt,
        resolve: pollingResolver({
          resolve: () => Date.now(),
          interval: 1000,
        })
      }
    }
  })
})
```

Doing that is useful when your backend does not provide any reactive primitives
and you still want to transmit changes to your client in a minimal manner:
Polling the resolver will only emit if the resolved value changed.

You can find more informations about this in the [advanced section](
../advanced/resolver-wrapping.md#-pollingresolver).

[rx-obs]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
