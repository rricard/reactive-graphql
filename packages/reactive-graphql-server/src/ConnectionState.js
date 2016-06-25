/* @flow */

import WebSocket from 'ws'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/mergeAll'

import type {Observer} from 'rxjs'

import type {StoreUpdate} from './StoreUpdate'

// # Reactive GraphQL Connection state
// Stores information about a connection with a client
export class ConnectionState {
  // ## State

  // ### Store update observable
  // storeUpdateSources is an higher-order observable that merges all of
  // the observables into one common flow
  storeUpdateSources: Observable<Observable<StoreUpdate>>;
  storeUpdateSourcesObserver: Observer<Observable<StoreUpdate>>;

  // ## Constructor
  // Creates a connection state with an optional WebSocket
  constructor(ws?: WebSocket) {
    this.storeUpdateSources = new Observable(observer =>
      this.storeUpdateSourcesObserver = observer)
    if(ws) {
      this.attachWebSocket(ws)
    }
  }

  // ## Add a store update observable
  // Adds an observable into observation!
  addStoreUpdateObservable(liveValue: Observable<StoreUpdate>) {
    this.storeUpdateSourcesObserver.next(liveValue)
  }

  // ## Get merged observable
  // Gets all of the store updates in one observable
  getAllStoreUpdates() {
    return this.storeUpdateSources.mergeAll()
  }

  // ## Attach the connection state to a websocket
  // It will receive observed data
  attachWebSocket(ws: WebSocket) {
    this.getAllStoreUpdates()
    .forEach((storeUpdate: StoreUpdate) =>
      ws.send(JSON.stringify(storeUpdate)))
  }
}
