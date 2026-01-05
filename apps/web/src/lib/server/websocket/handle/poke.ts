import { getPokeBackend } from '#lib/server/replicache/poke/poke-backend.js'
import { defineWebsocketHandler } from '#lib/server/websocket/define.js'

export default defineWebsocketHandler('/websocket', async (options) => {
  const { socket, sessionUserId } = options

  socket.send(JSON.stringify({ type: 'hello ' }))

  const pokeBackend = getPokeBackend()

  // when the workspace is poked, send a message to the client
  const unsubscribe = pokeBackend.addListener({
    userId: sessionUserId,
    callback: () => {
      socket.send(JSON.stringify({ type: 'poke' }))
    },
  })

  socket.on('close', () => {
    unsubscribe()
  })
})
