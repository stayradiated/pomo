import type { Doc } from '@stayradiated/pomo-doc'
import { getStreamList } from '@stayradiated/pomo-doc'
import { render } from 'ink'
import React from 'react'
import { StreamTable } from './stream-table.js'

type ListStreamsOptions = {
  doc: Doc
}

const listStreams = (options: ListStreamsOptions): undefined | Error => {
  const { doc } = options

  const streamList = getStreamList({ doc })

  render(<StreamTable streamList={streamList} />)

  return
}

export { listStreams }
