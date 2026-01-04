import type { ServerMutatorDefsImportMap } from './types.js'

const mutators: ServerMutatorDefsImportMap = {
  ping: import('./ping.server.js'),

  stream_create: import('./stream-create.server.js'),

  label_create: import('./label-create.server.js'),

  point_create: import('./point-create.server.js'),
}

export { mutators }
