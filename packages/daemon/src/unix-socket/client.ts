import net from 'node:net'
import EventEmitter from 'node:events'

type ClientOptions = {
  path: string // Path to socket, defaults to /tmp/crocket-ipc.sock
  timeout?: number // In ms, defaults to 2000 for server and 5000 for client
  reconnect?: number // How many ms between reconnection attempts, defaults to -1 (disabled)
  encoding?: BufferEncoding // Encoding for transmission, defaults to utf8
}

const separator = '<<<EOM\0'

class Client {
  mediator: EventEmitter
  sockets: net.Socket[]
  connectTimeout: NodeJS.Timeout | undefined
  buffer: string | undefined

  path: string
  reconnect: number
  timeout: number
  encoding: BufferEncoding

  constructor(options: ClientOptions) {
    this.mediator = new EventEmitter()

    // Register bogus error listener, but why?
    this.mediator.on('error', () => {})

    this.sockets = []
    this.connectTimeout = void 0
    this.buffer = void 0

    this.path = options.path

    this.reconnect = options.reconnect ?? -1
    this.timeout = options.timeout ?? 5000
    this.encoding = options.encoding ?? 'utf8'

    return this
  }

  private _onMessage(message: string, socket: net.Socket) {
    try {
      const incoming = JSON.parse(message)
      if (incoming && incoming.topic) {
        this.mediator.emit(incoming.topic, incoming.data, socket)
      } else {
        this.mediator.emit('error', new Error('Invalid data received.'))
      }
    } catch (error) {
      this.mediator.emit('error', error)
    }
  }

  private _onData(data: string, socket: net.Socket) {
    // Append to buffer
    if (this.buffer) {
      this.buffer += data
    } else {
      this.buffer = data
    }

    // Did we get a separator
    if (data.includes(separator)) {
      while (this.buffer.includes(separator)) {
        const message = this.buffer.slice(
          0,
          Math.max(0, this.buffer.indexOf(separator)),
        )
        this.buffer = this.buffer.slice(
          Math.max(0, this.buffer.indexOf(separator) + separator.length),
        )
        if (message) {
          this._onMessage(message, socket)
        }
      }
    }
  }

  // Register a callback for a mediator event
  on(event: string, callback: () => void): this {
    this.mediator.on(event, callback)
    return this
  }

  // Emit a mediator message
  emit(topic: string, data: unknown, callback?: (error?: Error) => void): this {
    try {
      const message = JSON.stringify({ topic, data }) + separator
      for (const socket of this.sockets) {
        socket.write(message)
      }

      if (callback) {
        callback(undefined)
      }
    } catch (unknownError: unknown) {
      const error =
        unknownError instanceof Error
          ? unknownError
          : new Error(`Unknown error: ${JSON.stringify(unknownError)}`)
      if (callback) {
        callback(error)
      } else {
        this.mediator.emit('error', error)
      }
    }

    return this
  }

  // Close IPC connection
  close(): this {
    this.reconnect = -1
    clearTimeout(this.connectTimeout)

    const socket = this.sockets[0]
    if (socket) {
      socket.destroy()
    }

    return this
  }

  // Connect to a server
  connect(callback?: (error?: Error) => void): this {
    const self = this

    const socket = new net.Socket()
    this.sockets = [socket]

    let flagConnected = false

    const connected = () => {
      flagConnected = true
      clearTimeout(self.connectTimeout)
      if (callback) {
        callback()
      }
    }

    const connect = (isFirst: boolean) => {
      socket.connect(self.path, isFirst ? connected : undefined)

      self.connectTimeout = setTimeout(() => {
        if (!flagConnected) {
          socket.destroy()
          if (self.reconnect === -1 && callback) {
            callback(new Error('Connection timeout'))
          }
        }
      }, self.timeout)
    }

    socket.setEncoding(self.encoding)

    socket.on('error', (e) => {
      self.mediator.emit('error', e)
    })

    socket.on('data', (data) => {
      self._onData(data.toString(), socket)
    })

    socket.on('close', () => {
      if (self.reconnect > 0) {
        setTimeout(() => {
          connect(false)
        }, self.reconnect)
      } else {
        self.mediator.emit('close')
      }
    })

    connect(true)

    return this
  }
}

export { Client }
