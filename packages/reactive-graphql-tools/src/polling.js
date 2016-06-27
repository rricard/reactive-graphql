/* @flow */

import * as Rx from 'rxjs'

import type {
  GraphQLFieldResolveFn,
  GraphQLResolveInfo,
} from 'graphql'

import {reactiveResolver} from './reactive'

export function pollingResolver({resolve, interval}: {
  resolve: GraphQLFieldResolveFn,
  interval?: number,
  compare?: (lastResolution: any, newResolution: any) => boolean,
}): GraphQLFieldResolveFn {
  return reactiveResolver({
    resolve,
    observe: (...args) =>
      Rx.Observable.interval(interval || 10000/*ms*/)
      .map(tick => resolve(...args))
  })
}
