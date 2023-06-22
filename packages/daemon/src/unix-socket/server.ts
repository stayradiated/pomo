import net from 'node:net'
import EventEmitter from 'node:events'

type ServerOptions = {
  path: string // Path to socket, defaults to /tmp/crocket-ipc.sock
  encoding?: BufferEncoding // Encoding for transmission, defaults to utf8
}

const separator = '<<<EOM\0'

class Server {
  mediator: EventEmitter
  sockets: net.Socket[]
  connectTimeout: NodeJS.Timeout | undefined
  buffer: string | undefined
  server: net.Server

  path: string
  encoding: BufferEncoding

  constructor(options: ServerOptions) {
    this.mediator = new EventEmitter()

    // Register bogus error listener, but why?
    this.mediator.on('error', () => {})

    this.sockets = []
    this.connectTimeout = void 0
    this.buffer = void 0

    this.path = options.path
    this.encoding = options.encoding ?? 'utf8'

    this.server = net.createServer()

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

  // Close IPC connection, used for both server and client
  close(callback: () => void): this {
    this.server.close()

    if (callback) {
      this.server.on('close', callback)
    }

    return this
  }

  //  Start listening
  listen(callback: () => void): this {
    const self = this

    this.server.on('error', (e) => self.mediator.emit('error', e))

    // New connection established
    this.server.on('connection', (socket) => {
      console.log('new connection!')

      self.sockets.push(socket)
      self.mediator.emit('connect', socket)
      socket.setEncoding(self.encoding)
      socket.on('data', (data) => {
        self._onData(data.toString(), socket)
      })
      socket.on('close', (_hadError) => {
        self.mediator.emit('disconnect', socket)
        self.sockets.splice(self.sockets.indexOf(socket), 1)
      })
      socket.on('error', (e) => {
        self.mediator.emit('error', e)
      })
    })

    this.server.on('close', () => {
      self.mediator.emit('close')
    })

    // Start listening
    this.server.listen(this.path, callback)

    return this
  }
}

export { Server }
