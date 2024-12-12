import type { Tree } from '@stayradiated/pomo-core'
import { getTree } from '@stayradiated/pomo-core'
import type { Stream } from '@stayradiated/pomo-doc'
import { Box, Text } from 'ink'
import React from 'react'

type StreamTreeProps = {
  streamTree: Tree<Stream>
}

const StreamTree = (props: StreamTreeProps) => {
  const { streamTree } = props

  const rows = streamTree.map((streamLeaf) => {
    const { node: stream, children } = streamLeaf
    const { id, name, index } = stream
    const ref = stream.id.slice(0, 7)

    return (
      <Box key={id} flexDirection="column">
        <Box>
          <Text color="magenta">{ref}</Text>
          <Text color="green"> {index}</Text>
          <Text> {name}</Text>
        </Box>
        {children && (
          <Box marginLeft={4}>
            <StreamTree streamTree={children} />
          </Box>
        )}
      </Box>
    )
  })

  return <Box flexDirection="column">{rows}</Box>
}

type StreamTableProps = {
  streamList: Stream[]
}

const StreamTable = (props: StreamTableProps) => {
  const { streamList } = props

  const streamTree = getTree(streamList)

  return <StreamTree streamTree={streamTree} />
}

export { StreamTable }
