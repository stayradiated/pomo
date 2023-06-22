const { Server } = await import('./dist/index.js')

const server = new Server({
  path: './test.sock',
})

server.on('error', (error) => {
  console.error(error)
})

server.on('greet', (data, socket) => {
  const separator = '<<<EOM\0'
  socket.write(
    JSON.stringify({
      topic: 'greet',
      data: `hello ${data.name}`,
    }) + separator,
  )
})

server.listen((error) => {
  if (error) {
    console.error(error)
    return
  }

  console.log('listening')
})
