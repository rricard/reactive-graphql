/* @flow */

import assert from 'assert'
import WebSocket from 'ws'
import * as Rx from 'rxjs'

import {
  GraphqlWSS,
} from '../src'

describe('GraphqlWSS', () => {
  let port = 8000
  it('creates a connectable websocket server', (done) => {
    const wss = new GraphqlWSS({port: ++port})
    const ws = new WebSocket(`ws://localhost:${port}/graphql`)
    ws.on('open', () => {
      ws.close()
      wss.close()
      done()
    })
  })

  it('sends an unique id to the client at the connection', (done) => {
    const wss = new GraphqlWSS({port: ++port})
    const ws = new WebSocket(`ws://localhost:${port}/graphql`)
    ws.on('message', data => {
      const {socketId} = JSON.parse(data)
      assert(socketId.length > 0)
      ws.close()
      wss.close()
      done()
    })
  })

  it('can be used as a vanilla wss', (done) => {
    const wss = new GraphqlWSS({port: ++port})
    const ws = new WebSocket(`ws://localhost:${port}/graphql`)
    wss.on('connection', () => {
      ws.close()
      wss.close()
      done()
    })
  })

  it('registers connection states behind unique ids', (done) => {
    const wss = new GraphqlWSS({port: ++port})
    const ws0 = new WebSocket(`ws://localhost:${port}/graphql`)
    ws0.on('message', data => {
      const {socketId: ws0sid} = JSON.parse(data)
      const ws1 = new WebSocket(`ws://localhost:${port}/graphql`)
      ws1.on('message', data => {
        const {socketId: ws1sid} = JSON.parse(data)
        assert(ws0sid !== ws1sid)
        assert(wss.getConnectionState(ws0sid))
        assert(wss.getConnectionState(ws1sid))
        assert(!wss.getConnectionState("nope"))
        ws0.close()
        ws1.close()
        wss.close()
        done()
      })
    })
  })

  it('cleans up connection states', (done) => {
    const wss = new GraphqlWSS({port: ++port})
    const ws = new WebSocket(`ws://localhost:${port}/graphql`)
    ws.on('message', data => {
      const {socketId} = JSON.parse(data)
      ws.on('close', () => {
        setTimeout(() => {
          assert(!wss.getConnectionState(socketId))
          wss.close()
          done()
        }, 10)
      })
      ws.close()
    })
  })

  it('should carry subscriptions', (done) => {
    const wss = new GraphqlWSS({port: ++port})
    const obs = new Rx.ReplaySubject()
    obs.next({path: ['x'], data: 'y'})
    const ws = new WebSocket(`ws://localhost:${port}/graphql`)
    ws.on('message', data => {
      data = JSON.parse(data)
      if(data && data.socketId) {
        wss.getConnectionState(data.socketId).addStoreUpdateObservable(obs)
      }
      if(data && data.path && data.data) {
        assert.equal(data.path[0], 'x')
        assert.equal(data.data, 'y')
        ws.close()
        done()
      }
    })
  })
})
