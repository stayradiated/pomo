import type { ServerMutator } from './types.ts'

const ping: ServerMutator<'ping'> = async (_context, options) => {
  const { message } = options

  console.info('ping', message)
}

export default ping
