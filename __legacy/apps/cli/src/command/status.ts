import { mapPointListToLineList } from '@stayradiated/pomo-core'
import {
  getLabelById,
  getStreamById,
  getStreamByName,
  retrievePointList,
} from '@stayradiated/pomo-doc'
import type { Doc } from '@stayradiated/pomo-doc'
import { CliCommand } from 'cilly'
import * as dateFns from 'date-fns'
import { getDoc } from '#src/lib/doc.js'

type HandlerOptions = {
  doc: Doc
  where: { streamId?: string }
  currentTime: number
}

const handler = async (options: HandlerOptions): Promise<undefined | Error> => {
  const { doc, currentTime, where } = options

  const pointList = retrievePointList({
    doc,
    startDate: currentTime,
    endDate: currentTime,
    where: {
      streamIdList: where.streamId ? [where.streamId] : undefined,
    },
  })

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  for (const line of lineList) {
    const stream = getStreamById({ doc, streamId: line.streamId })
    if (stream instanceof Error) {
      return stream
    }

    const streamName = stream.name

    const elapsed = dateFns.intervalToDuration({
      start: line.startedAt,
      end: currentTime,
    })

    console.log(
      JSON.stringify({
        stream: streamName,
        labels: line.labelIdList.map((labelId) => {
          const label = getLabelById({ doc, labelId })
          if (label instanceof Error) {
            return label
          }

          return label.name
        }),
        elapsed: `${dateFns.formatDuration(elapsed, {
          format:
            elapsed.hours || elapsed.minutes
              ? ['hours', 'minutes']
              : ['seconds'],
        })} ago`,
      }),
    )
  }
}

const statusCmd = new CliCommand('status')
  .withDescription('Show current status')
  .withOptions({
    name: ['-s', '--stream'],
    description: 'Filter points by a Stream ',
    args: [{ name: 'name', description: 'Name of the stream', required: true }],
  })
  .withHandler(async (_args, options, _extra) => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    let whereStreamId: string | undefined
    if (options.stream) {
      const stream = getStreamByName({ doc, name: options.stream })
      if (stream instanceof Error) {
        throw stream
      }

      whereStreamId = stream.id
    }

    return handler({
      doc,
      where: { streamId: whereStreamId },
      currentTime: Date.now(),
    })
  })

export { statusCmd }
