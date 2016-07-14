/* @flow */

import invariant from "invariant"
import Observable from 'rxjs/Observable'
import ReplaySubject from 'rxjs/ReplaySubject'
import 'rxjs/add/observable/dom/webSocket'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/toPromise'

export type StoreUpdate = {
  path: Array<string>,
  data: ?mixed,
  errors?: ?Array<Error>,
}

export type IReactiveNetworkLayer = {
  observable: () => Observable<StoreUpdate>,
  connectionId: () => Promise<string>,
}

export class ReactiveNetworkLayer {
  storeObservable: Observable<StoreUpdate>;
  connectionIdSubject: ReplaySubject<string>;

  constructor(urlConfigOrSource: string|mixed) {
    this.storeObservable = Observable.websocket(urlConfigOrSource)
    .map(jsonData => JSON.parse(jsonData))
    .map(this._mapSocketMessages.bind(this))
    .filter(this._filterSocketMessages.bind(this))
    this.connectionIdSubject = new ReplaySubject()
  }

  observable(): Observable<StoreUpdate> {
    return this.storeObservable
  }

  connectionId(): Promise<string> {
    return this.connectionIdSubject.toPromise()
  }


  _mapSocketMessages(rawMessage: mixed) {
    if(rawMessage.socketId) {
      this.connectionIdSubject.next(rawMessage.socketId)
      this.connectionIdSubject.complete()
      return rawMessage
    }
    if(rawMessage.errors) {
      /* eslint no-console: 0 */
      console.error(
        "The reactive backend returned errors",
        rawMessage.errors
      )
    }
    invariant(
      rawMessage.path && rawMessage.path.length > 0,
      "The store update received in the websocket does not describe a path. " +
      "Please add a path array of strings in your store update."
    )
    invariant(
      rawMessage.data !== undefined,
      "The store update received in the websocket does not carry data. " +
      "Please set the data of your store update. " +
      "Note that null is a valid data value but undefined is not."
    )
    return rawMessage
  }

  _filterSocketMessages(rawMessage: mixed) {
    return (
      rawMessage.path &&
      rawMessage.path.length > 0
    )
  }
}
