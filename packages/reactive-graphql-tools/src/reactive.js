/* @flow */

import * as Rx from 'rxjs'
import {completeValue} from 'graphql/execution/execute'

import type {
  GraphQLFieldResolveFn,
  GraphQLResolveInfo,
} from 'graphql'
import type {
  ConnectionState
} from 'reactive-graphql-server'

export function reactiveResolver({resolve, observe}: {
  resolve: GraphQLFieldResolveFn,
  observe: (
    obj: any, args: {[arg: string]: any},
    context: mixed&{connectionState: ConnectionState},
    info: GraphQLResolveInfo
  ) => Rx.Observable<mixed>,
}): GraphQLFieldResolveFn {
  return (obj, args, context, info) => {
    if(info.fieldASTs.directives.filter(
      d => d.name.value === "live"
    ).length > 0) {
      const exeContext = {
        schema: info.schema,
        fragments: info.fragments,
        rootValue: info.rootValue,
        operation: info.operation,
        variableValues: info.variableValues,
        contextValue: context,
      };
      context.connectionState.addStoreUpdateObservable(
        observe(obj, args, context, info)
        .map(observedValue => Rx.Observable.fromPromise(completeValue(
            exeContext,
            info.returnType,
            info.fieldASTs,
            info,
            info.path,
            observedValue
          )
          .then(completedValue => ({
            path: info.path,
            data: completedValue,
          }))
        ))
        .mergeAll()
      )
    }

    return resolve(obj, args, context, info)
  }
}
