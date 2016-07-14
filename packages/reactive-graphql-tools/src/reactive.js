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

export function reactiveResolver({resolve, observe}: {
  resolve: GraphQLFieldResolveFn,
  observe: (
    obj: any, args: {[arg: string]: any},
    context: mixed&{connectionState: ConnectionState},
    info: GraphQLResolveInfo
  ) => Rx.Observable<mixed>,
}): GraphQLFieldResolveFn {
  return (obj, args, context, info) => {
    const {
      fieldASTs: [field],
      returnType,
      fragments,
      variableValues,
      schema,
    } = info
    if(field.directives.filter(
      d => d.name.value === "live"
    ).length > 0) {
      context.connectionState.addStoreUpdateObservable(
        observe(obj, args, context, info)
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
      )
    }

    return resolve(obj, args, context, info)
  }
}
