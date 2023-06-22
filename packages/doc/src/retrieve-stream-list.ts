import type { Stream } from '@stayradiated/pomo-core'
import type { AutomergeDoc } from './types.js'

type RetrieveOptions = {
  doc: AutomergeDoc
}

const retrieveStreamList = (options: RetrieveOptions): Stream[] => {
  const { doc } = options

  const streamList = Object.values(doc.stream)

  return streamList
}

export { retrieveStreamList }
