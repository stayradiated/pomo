import { CliCommand } from 'cilly'
import { client } from '@stayradiated/pomo-daemon'

type HandlerOptions = {
  trpc: ReturnType<(typeof client)['getTrpcClient']>
}

const handler = async (options: HandlerOptions) => {
  const { trpc } = options

  const streamList = await trpc.retrieveStreamList.query()

  const pointList = await trpc.retrieveAllPointList.query()

  for (const stream of streamList) {
    console.log(JSON.stringify(stream))
  }

  for (const point of pointList) {
    console.log(JSON.stringify(point))
  }
}

const exportCmd = new CliCommand('export')
  .withDescription('Export all the things')
  .withHandler(async () => {
    const trpc = client.getTrpcClient()

    await handler({ trpc })
  })

export { exportCmd }
