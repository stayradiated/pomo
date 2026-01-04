import type { LocalMutatorDefsImportMap } from './types.js'

const mutators: LocalMutatorDefsImportMap = {
  ping: import('./ping.js'),

  stream_create: import('./stream-create.js'),

  label_create: import('./label-create.js'),

  point_create: import('./point-create.js'),
}

export { mutators }
