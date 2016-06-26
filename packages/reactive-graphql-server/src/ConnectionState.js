/* @flow */

import WebSocket from 'ws'
import * as Rx from 'rxjs'

import type {StoreUpdate} from './StoreUpdate'

// # Reactive GraphQL Connection state
// Stores information about a connection with a client
export class ConnectionState {
  // ## State

  // ### Store update observable
  // storeUpdateSources is an higher-order observable that merges all of
  // the observables into one common flow
  storeUpdateSubject: Rx.Subject<Rx.Observable<StoreUpdate>>;

  // ## Constructor
  // Creates a connection state with an optional WebSocket
  constructor(ws?: WebSocket) {
    this.storeUpdateSubject = new Rx.Subject()
    if(ws) {
      this.attachWebSocket(ws)
    }
  }

  // ## Add a store update observable
  // Adds an observable into observation!
  addStoreUpdateObservable(storeUpdates: Rx.Observable<StoreUpdate>) {
    this.storeUpdateSubject.next(storeUpdates)
  }

  // ## Get merged observable
  // Gets all of the store updates in one observable
  getAllStoreUpdates(): Rx.Observable {
    return this.storeUpdateSubject.mergeAll()
  }

  // ## Attach the connection state to a websocket
  // It will receive observed data
  attachWebSocket(ws: WebSocket) {
    this.getAllStoreUpdates()
    .forEach((storeUpdate: StoreUpdate) =>
      ws.send(JSON.stringify(storeUpdate)))
    .then(() => ws.close())
  }

  // ## Close observation
  close() {
    this.storeUpdateSubject.complete()
  }
}
