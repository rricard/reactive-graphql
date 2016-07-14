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
              resolve: (date) => date.getMilliseconds(),
            },
            second: {
              type: GraphQLInt,
              resolve: (date) => date.getSeconds(),
            },
            minute: {
              type: GraphQLInt,
              resolve: (date) => date.getMinutes(),
            },
            hour: {
              type: GraphQLInt,
              resolve: (date) => date.getHours(),
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
    const csSubs = connectionState.getAllStoreUpdates().subscribe({
      next: ({path, data}) => {
        csSubs.unsubscribe()
        assert.equal(path.length, 1)
        assert.equal(path[0], "timestamp")
        const liveTimestamp = data
        assert(liveTimestamp > resolvedTimestamp)
        done()
      }
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

  it('should observe an object type field' , (done) => {
    const connectionState = new ConnectionState()
    let resolvedTime = null
    const csSubs = connectionState.getAllStoreUpdates().subscribe({
      next: ({path, data}) => {
        csSubs.unsubscribe()
        assert.equal(path.length, 1)
        assert.equal(path[0], "time")
        assert(resolvedTime && (
          data.millisecond > resolvedTime.millisecond ||
          data.second > resolvedTime.second ||
          data.minute > resolvedTime.minute ||
          data.hour > resolvedTime.hour
        ))
        done()
      }
    })

    graphql(
      reactiveSchema,
      `
        {
          time @live {
            millisecond
            second
            minute
            hour
          }
        }
      `,
      {},
      {connectionState}
    )
    .then(({data, errors}) => {
      resolvedTime = data.time
    })
  })
})
