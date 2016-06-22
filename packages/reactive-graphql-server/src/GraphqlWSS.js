/* @flow */

import WebSocket, {
  Server as WebSocketServer,
} from 'ws'
import {
  Map,
} from 'immutable'
import ObjectID from 'bson-objectid'

import type {
  Server as HTTPServer,
  ClientRequest as HTTPClientRequest,
} from 'http'

import {
  ConnectionState,
} from "./ConnectionState"

type WSClientInfo = {
  origin: string|any,
  secure: boolean,
  req: HTTPClientRequest,
}

type WebSocketServerOptions = {
  host?: string,
  port?: ?number,
  server?: ?HTTPServer,
  verifyClient?: ?(info: WSClientInfo, cb: Function) => void,
  handleProtocols?: ?(protList: Array<string>, cb: Function) => void,
  path?: ?string,
  noServer?: boolean,
  disableHixie?: boolean,
  clientTracking?: boolean,
  perMessageDeflate?: boolean,
  maxPayload?: ?number,
}

type GraphqlWebSocketServerOptions = WebSocketServerOptions&{

}

// # GraphqlWSS WebSocketServer
// A websocket server for handling Reactive GraphQL sockets.
export class GraphqlWSS extends WebSocketServer {
  // ## Internal state

  // ### Connections
  // We track connections using an unique identifier
  connections: Map<string, ConnectionState>;

  // ## Constructor
  // Creates a new server using classic WebSocketServer options.
  // Also setups internal connection tracking and defaults wss path to /graphql
  constructor({
    path = "/graphql",
    ...wssOptions
  }: GraphqlWebSocketServerOptions, cb?: Function) {
    super({path, ...wssOptions}, cb)

    this.connections = Map()
    this.on('connection', this._handleConnection)
  }

  // ## Connection state getter
  // Returns the connection state associated to
  getConnectionState(id: string): ConnectionState {
    return this.connections.get(id)
  }

  // ## Internal connection handler
  // Registers the connection internally with an id.
  // Handle socket closing to clean the connection.
  // Send the socket id to the client.
  _handleConnection(ws: WebSocket) {
    const socketId = this._generateRandomID()
    this.connections = this.connections.set(socketId, new ConnectionState())
    ws.on('close', () => this.connections = this.connections.delete(socketId))
    ws.send(JSON.stringify({socketId}))
  }

  // # Random connection id generation
  // Generates an id that looks like MongoDB object ids (but it has nothing
  // to do with MongoDB though)
  _generateRandomID(): string {
    return ObjectID().toString()
  }
}
