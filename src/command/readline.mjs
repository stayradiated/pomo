import * as readline from 'node:readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
rl.question('test ', () => {
  rl.close()
})
