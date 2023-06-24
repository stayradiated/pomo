import type { Doc, Stream } from './types.js'

type GetOptions = {
  doc: Doc
}

const getStreamList = (options: GetOptions): Stream[] => {
  const { doc } = options

  const streamMap = doc.getMap('stream')
  const streamList = Object.values(streamMap.toJSON()) as Stream[]

  return streamList
}

export { getStreamList }
