import { CliCommand } from 'cilly'
import * as chrono from 'chrono-node'
import { intervalToDuration, formatDuration } from 'date-fns'
import { mapPointListToLineList, stripComments } from '@stayradiated/pomo-core'
import { client } from '@stayradiated/pomo-daemon'

type HandlerOptions = {
  trpc: ReturnType<typeof client.getTrpcClient>
  filter: { streamId?: string }
  currentTime: Date
}

const handler = async (options: HandlerOptions): Promise<void | Error> => {
  const { trpc, currentTime, filter } = options

  const pointList = await trpc.retrievePointList.query({
    since: currentTime.getTime(),
    filter,
  })
  if (pointList instanceof Error) {
    return pointList
  }

  const lineList = mapPointListToLineList(pointList)
  if (lineList instanceof Error) {
    return lineList
  }

  for (const line of lineList) {
    const streamName = await trpc.getStreamNameById.query({ id: line.streamId })
    if (streamName === undefined) {
      return new Error(`Stream not found: ${line.streamId}`)
    }

    const elapsed = intervalToDuration({
      start: line.startedAt,
      end: currentTime,
    })

    console.log(
      JSON.stringify({
        stream: streamName,
        value: stripComments(line.value),
        elapsed:
          formatDuration(elapsed, {
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
  .withOptions(
    {
      name: ['-s', '--stream'],
      description: 'Filter points by a Stream ',
      args: [
        { name: 'name', description: 'Name of the stream', required: true },
      ],
    },
    {
      name: ['-f', '--from'],
      description: 'Show points from a certain time',
      args: [
        {
          name: 'datetime',
          description: 'Date/time to show points from',
          required: true,
        },
      ],
    },
  )
  .withHandler(async (_args, options, _extra) => {
    const trpc = client.getTrpcClient()

    const currentTime = options['from']
      ? chrono.parseDate(options['from'])
      : new Date()

    if (currentTime instanceof Error) {
      throw currentTime
    }

    const filterStreamId = options['stream']
      ? await trpc.getStreamIdByName.query({ name: options['stream'] })
      : undefined

    return handler({
      trpc,
      filter: { streamId: filterStreamId },
      currentTime,
    })
  })

export { statusCmd }
