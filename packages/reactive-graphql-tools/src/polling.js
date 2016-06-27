/* @flow */

import * as Rx from 'rxjs'

import type {
  GraphQLFieldResolveFn,
  GraphQLResolveInfo,
} from 'graphql'

export function pollingResolver({resolve, observe}: {
  resolve: GraphQLFieldResolveFn,
  interval?: number,
  compare?: (lastResolution: any, newResolution: any) => boolean,
}): GraphQLFieldResolveFn {
  return (obj, args, context, info) => {
    return resolve(obj, args, context, info)
  }
}
