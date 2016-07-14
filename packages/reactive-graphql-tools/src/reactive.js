/* @flow */

import * as Rx from 'rxjs'
import {
  execute,
  GraphQLSchema,
} from 'graphql'

import type {
  GraphQLFieldResolveFn,
  GraphQLResolveInfo,
  Field,
  Document,
  OperationDefinition,
} from 'graphql'
import type {
  ConnectionState
} from 'reactive-graphql-server'

type ObserveFunction = (
  obj: any,
  args: {[arg: string]: any},
  context: mixed&{connectionState: ConnectionState},
  info: GraphQLResolveInfo
) => Rx.Observable<mixed>;

function handleLiveObservable(
  observable: Rx.Observable,
  connectionState: ConnectionState,
  info: GraphQLResolveInfo
): void {
  const {
    fieldASTs: [field],
    returnType,
    fragments,
    variableValues,
    schema,
  } = info

  const liveChangesObservable = observable
  .map(observedValue => {
    if(field.selectionSet) {
      const fieldExecutionSchema = new GraphQLSchema({
        query: returnType,
        directives: schema.getDirectives(),
      })
      const fieldExecutionOperationAST: OperationDefinition = {
        kind: 'OperationDefinition',
        operation: 'query',
        selectionSet: field.selectionSet,
      }
      const fieldExecutionDocumentAST: Document = {
        kind: 'Document',
        definitions: [
          fieldExecutionOperationAST,
          ...Object.keys(fragments).map(k => fragments[k])
        ]
      }
      return Rx.Observable.fromPromise(
        execute(
          fieldExecutionSchema,
          fieldExecutionDocumentAST,
          observedValue,
          context,
          variableValues
        )
        .then(({data, errors}) => ({
          path: info.path,
          data,
          errors,
        }))
      )
    } else {
      return Rx.Observable.fromPromise(Promise.resolve({
        path: info.path,
        data: observedValue,
      }))
    }
  })
  .mergeAll()

  connectionState.addStoreUpdateObservable(liveChangesObservable)
}

export function reactiveResolver({resolve, observe}: {
  resolve: GraphQLFieldResolveFn,
  observe: ObserveFunction,
}): GraphQLFieldResolveFn {
  return (obj, args, context, info) => {
    const {
      fieldASTs: [field],
    } = info
    return Promise.resolve(resolve(obj, args, context, info))
    .then(resolvedValue => {
      if(
        field.directives.some(d => d.name.value === "live") &&
        context && context.connectionState
      ) {
        const liveObservable = observe(obj, args, context, info)
        handleLiveObservable(liveObservable, context.connectionState, info)
      }

      return resolvedValue
    })
  }
}
