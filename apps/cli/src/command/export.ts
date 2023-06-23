import { CliCommand } from 'cilly'
import { proxy } from '#src/lib/proxy.js'

type HandlerOptions = Record<string, unknown>

const handler = async (_options: HandlerOptions): Promise<void | Error> => {
  const streamList = await proxy.retrieveStreamList({})
  if (streamList instanceof Error) {
    return streamList
  }

  const pointList = await proxy.retrieveAllPointList({})
  if (pointList instanceof Error) {
    return pointList
  }

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
    const result = await handler({})
    if (result instanceof Error) {
      throw result
    }
  })

export { exportCmd }
