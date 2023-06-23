import * as Y from 'yjs'

const encodeStateVectorFromUpdate = (update: Uint8Array): Uint8Array => {
  const vector = Y.encodeStateVectorFromUpdateV2(update)
  return vector
}

export { encodeStateVectorFromUpdate }
