import type { Doc, Stream } from './types.js'

type RetrieveOptions = {
  doc: Doc
}

const retrieveStreamList = (options: RetrieveOptions): Stream[] => {
  const { doc } = options

  const streamMap = doc.getMap('stream')
  const streamList = Object.values(streamMap.toJSON()) as Stream[]

  return streamList
}

export { retrieveStreamList }
