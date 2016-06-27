/* @flow */

import * as Rx from 'rxjs'
import {completeValueCatchingError} from './graphql/execute-override'

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
      context.connectionState.addStoreUpdateObservable(
        observe(obj, args, context, info)
        .map(observedValue => {
          let exeContext = {
            schema: info.schema,
            fragments: info.fragments,
            rootValue: info.rootValue,
            operation: info.operation,
            variableValues: info.variableValues,
            contextValue: context,
            errors: [],
          };
          const data = completeValueCatchingError(
            exeContext,
            info.returnType,
            info.fieldASTs,
            info,
            info.path,
            observedValue
          );
          return {
            path: info.path,
            data,
            errors: exeContext.errors.length > 0 ?
              exeContext.errors : undefined,
          };
        })
      )
    }

    return resolve(obj, args, context, info)
  }
}
