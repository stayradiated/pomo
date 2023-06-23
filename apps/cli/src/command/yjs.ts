import * as fs from 'node:fs/promises'
import { CliCommand } from 'cilly'
import type { KyselyDb } from '@stayradiated/pomo-db'
import * as pomoDb from '@stayradiated/pomo-db'
import {
  createDocWithData,
  encodeStateAsUpdate,
  loadDoc,
  retrieveStreamList,
  retrieveAllPointList,
} from '@stayradiated/pomo-doc'
import type { User, Stream, Point } from '@stayradiated/pomo-core'
import { getDb } from '#src/lib/db.js'

type DumpHandlerOptions = {
  db: KyselyDb
  outputFilePath: string
}

const dumpHandler = async (options: DumpHandlerOptions) => {
  const { db, outputFilePath } = options

  console.time('retrieveData')
  const userList = await pomoDb.retrieveUserList({ db })
  const streamList = await pomoDb.retrieveStreamList({ db })
  const pointList = await pomoDb.retrieveAllPointList({ db })

  const userRecord = userList.reduce<Record<string, User>>((acc, user) => {
    acc[user.id] = user
    return acc
  }, {})

  const streamRecord = streamList.reduce<Record<string, Stream>>(
    (acc, stream) => {
      acc[stream.id] = stream
      return acc
    },
    {},
  )

  const pointRecord = pointList.reduce<Record<string, Point>>((acc, point) => {
    acc[point.id] = point
    return acc
  }, {})
  console.timeEnd('retrieveData')

  console.time('createDocWithData')
  const doc = createDocWithData({
    user: userRecord,
    stream: streamRecord,
    point: pointRecord,
  })
  console.timeEnd('createDocWithData')

  console.time('saveAndWriteDoc')
  const byteArray = encodeStateAsUpdate(doc)
  await fs.writeFile(outputFilePath, byteArray)
  console.timeEnd('saveAndWriteDoc')
}

const dumpCmd = new CliCommand('dump')
  .withDescription('Dump the database')
  .withOptions({
    name: ['-o', '--output'],
    required: true,
    args: [
      {
        name: 'filePath',
        description: 'Output file path',
        required: true,
      },
    ],
  })
  .withHandler(async (_args, options) => {
    const { output: outputFilePath } = options
    const db = getDb()
    await dumpHandler({ db, outputFilePath })
  })

type RestoreHandlerOptions = {
  db: KyselyDb
  inputFilePath: string
}

const restoreHandler = async (options: RestoreHandlerOptions) => {
  const { inputFilePath } = options

  const byteArray = await fs.readFile(inputFilePath)
  const doc = loadDoc(byteArray)

  const streamList = retrieveStreamList({ doc })
  const pointList = retrieveAllPointList({ doc })

  for (const stream of streamList) {
    const streamPointList = pointList.filter(
      (point) => point.streamId === stream.id,
    )
    console.log(
      `Stream ${stream.id}: ${stream.name} (${streamPointList.length} points)`,
    )
  }
}

const restoreCmd = new CliCommand('restore')
  .withDescription('Restore the database')
  .withOptions({
    name: ['-i', '--input'],
    required: true,
    args: [
      {
        name: 'filePath',
        description: 'Input file path',
        required: true,
      },
    ],
  })
  .withHandler(async (_args, options) => {
    const { input: inputFilePath } = options
    const db = getDb()
    await restoreHandler({ db, inputFilePath })
  })

const yjsCmd = new CliCommand('yjs')
  .withDescription('Experiment with CRDTs')
  .withSubCommands(dumpCmd, restoreCmd)
  .withHandler(async () => {
    yjsCmd.help()
  })

export { yjsCmd }
