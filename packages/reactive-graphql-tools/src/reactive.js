/* @flow */

import * as Rx from 'rxjs'

import type {
  GraphQLFieldResolveFn,
  GraphQLResolveInfo,
} from 'graphql'

export function reactiveResolver({resolve, observe}: {
  resolve: GraphQLFieldResolveFn,
  observe: (
    obj: any, args: {[arg: string]: any}, context: any,
    info: GraphQLResolveInfo
  ) => Rx.Observable,
}): GraphQLFieldResolveFn {
  return (obj, args, context, info) => {
    return resolve(obj, args, context, info)
  }
}
