/* @flow */

import assert from 'assert'
import * as Rx from 'rxjs'
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
} from 'graphql'
import {
  ConnectionState,
} from 'reactive-graphql-server'

import {
  reactiveResolver,
  LiveDirective,
} from '../src'

const reactiveSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
      timestamp: {
        type: GraphQLString,
        resolve: reactiveResolver({
          resolve: () => Date.now(),
          observe: () => Rx.Observable.interval(10)
            .map(tick => Date.now()),
        }),
      },
      time: {
        type: new GraphQLObjectType({
          name: 'Time',
          fields: () => ({
            millisecond: {
              type: GraphQLInt,
              resolve: (date) => date.millisecond,
            },
            second: {
              type: GraphQLInt,
              resolve: (date) => date.second,
            },
            minute: {
              type: GraphQLInt,
              resolve: (date) => date.minute,
            },
            hour: {
              type: GraphQLInt,
              resolve: (date) => date.hour,
            },
          }),
        }),
        resolve: reactiveResolver({
          resolve: () => new Date(),
          observe: () => Rx.Observable.interval(10)
            .map(() => new Date()),
        }),
      },
    }),
  }),
  directives: [
    LiveDirective,
  ],
})

describe('reactive resolver wrapping', () => {
  it('should observe a scalar field' , (done) => {
    const testStartTimestamp = Date.now()
    let resolvedTimestamp = null
    const connectionState = new ConnectionState()
    const csSubs = connectionState.getAllStoreUpdates()
    .forEach(({path, data}) => {
      csSubs.unsubscribe()
      assert.equal(path.length, 1)
      assert.equal(path[0], "timestamp")
      const liveTimestamp = data
      assert(liveTimestamp > resolvedTimestamp)
      done()
    })

    graphql(
      reactiveSchema,
      `
        {
          timestamp @live
        }
      `,
      {},
      {connectionState}
    )
    .then(({data, errors}) => {
      resolvedTimestamp = data.timestamp
      assert(resolvedTimestamp > testStartTimestamp)
    })
  })
  })
})
