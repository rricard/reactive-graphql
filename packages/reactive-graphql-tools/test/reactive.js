/* @flow */

import * as Rx from 'rxjs'
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
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
        type: GraphQLInt,
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
  it('should observe a scalar field' , () => {
    const connectionState = new ConnectionState()
    const csSubs = connectionState.getAllStoreUpdates().subscribe({
      next(ts) {
        console.log('new timestamp', ts)
      }
    })
    return graphql(
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
      console.log(data, errors)
      return new Promise(res => setInterval(res, 100));
    })
  })
})
