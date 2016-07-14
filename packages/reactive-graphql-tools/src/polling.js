/* @flow */

import * as Rx from 'rxjs'

import type {
  GraphQLFieldResolveFn,
} from 'graphql'

import {reactiveResolver} from './reactive'

export function pollingResolver({resolve, interval = 10000/*ms*/}: {
  resolve: GraphQLFieldResolveFn,
  interval?: number,
  compare?: (lastResolution: any, newResolution: any) => boolean,
}): GraphQLFieldResolveFn {
  return reactiveResolver({
    resolve,
    observe: (...args) =>
      Rx.Observable.interval(interval)
      .map(() => resolve(...args)),
  })
}
