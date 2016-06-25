# Resolver Wrapping

## `reactiveResolver`

Reactive Resolver is an non-pure function that will mutate the `ConnectionState`
in the query context by attaching a new observable to it:

```js
reactiveResolver({
  resolve: GraphQLResolveFunction,
  observe: (
    obj: any, args: {[arg: string]: any}, context: any,
    info: GraphQLResolveInfo
  ) => Rx.Observable,
}): GraphQLResolveFunction
```

## `pollingResolver`

Polling resolver works the same way as `reactiveResolver` except it does the
polling logic for you (time interval + comparison):

```js
pollingResolver({
  resolve: GraphQLResolveFunction,
  interval?: number,
  compare?: (lastResolution: any, newResolution: any) => boolean,
}): GraphQLResolveFunction
```

A `compare` method can be defined to tell if the value is new or not. 
