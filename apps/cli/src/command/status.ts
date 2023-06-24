import { CliCommand } from 'cilly'
import * as dateFns from 'date-fns'
import { mapPointListToLineList, stripComments } from '@stayradiated/pomo-core'
import { proxy } from '#src/lib/proxy.js'

type HandlerOptions = {
  where: { streamId?: string }
  currentTime: number
}

const handler = async (options: HandlerOptions): Promise<void | Error> => {
  const { currentTime, where } = options

  const pointList = await proxy.retrievePointList({
    startDate: currentTime,
    endDate: currentTime,
    where,
  })
  if (pointList instanceof Error) {
    return pointList
  }

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  for (const line of lineList) {
    const streamName = await proxy.getStreamNameById({ id: line.streamId })
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
        value: stripComments(line.value),
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
    const whereStreamId = options['stream']
      ? await proxy.getStreamIdByName({ name: options['stream'] })
      : undefined

    if (whereStreamId instanceof Error) {
      throw whereStreamId
    }

    return handler({
      where: { streamId: whereStreamId },
      currentTime: Date.now(),
    })
  })

export { statusCmd }
