const { Client } = await import('./dist/index.js')

const client = new Client({
  path: './test.sock',
})

client.on('error', (error) => {
  console.error(error)
})

client.on('greet', (data) => {
  console.log(data)
})

client.connect((error) => {
  if (error) {
    console.error(error)
    return
  }

  console.log('connected')

  client.emit('greet', { name: 'George' }, (error) => {
    if (error) {
      console.error(error)
    }
  })
})
