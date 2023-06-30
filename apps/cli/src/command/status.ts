import { CliCommand } from 'cilly'
import * as dateFns from 'date-fns'
import { mapPointListToLineList } from '@stayradiated/pomo-core'
import {
  retrievePointList,
  getStreamIdByName,
  getStreamNameById,
  getLabelNameById,
} from '@stayradiated/pomo-doc'
import type { Doc } from '@stayradiated/pomo-doc'
import { getDoc } from '#src/lib/doc.js'

type HandlerOptions = {
  doc: Doc
  where: { streamId?: string }
  currentTime: number
}

const handler = async (options: HandlerOptions): Promise<void | Error> => {
  const { doc, currentTime, where } = options

  const pointList = retrievePointList({
    doc,
    startDate: currentTime,
    endDate: currentTime,
    where,
  })

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  for (const line of lineList) {
    const streamName = getStreamNameById({ doc, streamId: line.streamId })
    if (streamName === undefined) {
      return new Error(`Stream not found: ${line.streamId}`)
    }

    const elapsed = dateFns.intervalToDuration({
      start: line.startedAt,
      end: currentTime,
    })

    console.log(
      JSON.stringify({
        stream: streamName,
        labels: line.labelIdList.map((labelId) =>
          getLabelNameById({ doc, labelId }),
        ),
        elapsed:
          dateFns.formatDuration(elapsed, {
            format:
              elapsed.hours || elapsed.minutes
                ? ['hours', 'minutes']
                : ['seconds'],
          }) + ' ago',
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

    const whereStreamId = options['stream']
      ? getStreamIdByName({ doc, name: options['stream'] })
      : undefined

    if (options['stream'] && !whereStreamId) {
      throw new Error(`Could not find stream with id ${options['stream']}`)
    }

    return handler({
      doc,
      where: { streamId: whereStreamId },
      currentTime: Date.now(),
    })
  })

export { statusCmd }
