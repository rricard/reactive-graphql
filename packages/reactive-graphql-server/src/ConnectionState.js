/* @flow */

import WebSocket from 'ws'

// # Reactive GraphQL Connection state
// Stores information about a connection with a client
export class ConnectionState {
  // ## State

  // ### Websocket
  websocket: WebSocket;

  // ## Constructor
  // Creates a connection state from a websocket
  constructor(ws: WebSocket) {
    this.websocket = ws
  }
}
