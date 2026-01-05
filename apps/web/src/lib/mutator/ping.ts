import type { LocalMutator } from './types.ts'

const ping: LocalMutator<'ping'> = async (_context, options) => {
  const { message } = options

  console.info('ping', message)
}

export default ping
