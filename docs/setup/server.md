# Server setup

We'll guide you to wire your future Reactive GraphQL Schema to a websocket
that will be available for your client to subscribe on.

## Install server packages

You just need to use npm:

```
npm install --save reactive-graphql-server reactive-graphql-tools
```

## Carry reactive socket id into the schema's context

In order to have Reactive GraphQL be able to notify your client, we will need
to get the reactive socket id that your client connected to:
`reactive_socket_id`.

We'll just get that from the query string and inject it into the GraphQL
execution context as `reactiveSocketId`. Here is how we do that using
[Express GraphQL][express-graphql]:

```js
import express from 'express'
import graphqlHTTP from 'express-graphql'

import MyGraphQLSchema from './myschema'

const app = express()

app.use('/graphql', graphqlHTTP(req => ({
  schema: MyGraphQLSchema,
  graphiql: true,
  context: {reactiveSocketId: req.query.reactive_socket_id},
})))
```

## Mount the websocket server

You can now mount a `GraphqlWSS` like you would mount a [ws websocket
server][ws].

Here is what it would look like if we wrapped it around our previous express
app:

```js
import {createServer} from 'http'
import {GraphqlWSS} from 'reactive-graphql-server'

// ...

const httpServer = createServer()

const wss = new GraphqlWSS({server: httpServer})

server.on('request', app)
server.listen(3000, () => "Reactive GraphQL listening on port 3000")
```

Your server is now ready to serve Reactive GraphQL Schemas!

## References

- [ws websockets][ws]
- [Express GraphQL][express-graphql]

[express-graphql]:https://github.com/graphql/express-graphql
[ws]: https://github.com/websockets/ws
