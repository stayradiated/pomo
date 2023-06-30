import type { Doc, Stream } from './types.js'

type GetOptions = {
  doc: Doc
}

const getStreamList = (options: GetOptions): Stream[] => {
  const { doc } = options

  const streamMap = doc.getMap('stream')
  const streamList = Object.values(streamMap.toJSON()) as Stream[]

  streamList.sort((a, b) => {
    return a.index - b.index
  })

  return streamList
}

export { getStreamList }
