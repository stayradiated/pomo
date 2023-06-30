import React from 'react'
import { render } from 'ink'
import type { Doc } from '@stayradiated/pomo-doc'
import { getStreamList } from '@stayradiated/pomo-doc'
import { StreamTable } from './stream-table.js'

type ListStreamsOptions = {
  doc: Doc
}

const listStreams = (options: ListStreamsOptions): void | Error => {
  const { doc } = options

  const streamList = getStreamList({ doc })

  render(<StreamTable streamList={streamList} />)
}

export { listStreams }
