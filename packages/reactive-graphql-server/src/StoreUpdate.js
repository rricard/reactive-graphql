/* @flow */

// # StoreUpdate
// The type that represents a change in an already established store
export type StoreUpdate = {
  path: Array<string>,
  data: any,
}
