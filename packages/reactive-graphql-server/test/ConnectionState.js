/* @flow */

import assert from 'assert'
import * as Rx from 'rxjs'

import {
  ConnectionState,
} from '../src'

describe('ConnectionState', () => {
  it('should merge multiple observables', () => {
    const data = [
      {path: ['s1'], data: 0},
      {path: ['s1'], data: 1},
      {path: ['s2'], data: 0},
      {path: ['s2'], data: 1}
    ]
    const cs = new ConnectionState()
    const s1 = new Rx.ReplaySubject()
    const s2 = new Rx.ReplaySubject()
    cs.addStoreUpdateObservable(s1)
    cs.addStoreUpdateObservable(s2)
    cs.close()
    s1.next(data[0])
    s1.next(data[1])
    s1.complete()
    s2.next(data[2])
    s2.next(data[3])
    s2.complete()
    return cs.getAllStoreUpdates()
    .toArray()
    .forEach((a) => {
      assert.equal(a[0], data[0])
      assert.equal(a[1], data[1])
      assert.equal(a[2], data[2])
      assert.equal(a[3], data[3])
    })
  })
})
