import * as fs from 'node:fs/promises'
import { CliCommand } from 'cilly'
import type { KyselyDb } from '@stayradiated/pomo-db'
import {
  retrieveUserList,
  retrieveStreamList,
  retrieveAllPointList,
} from '@stayradiated/pomo-db'
import { loadDoc, saveDoc, createDocWithData } from '@stayradiated/pomo-doc'
import { getDb } from '#src/lib/db.js'
import { User, Stream, Point } from '@stayradiated/pomo-core'

type DumpHandlerOptions = {
  db: KyselyDb
  outputFilePath: string
}

const dumpHandler = async (options: DumpHandlerOptions) => {
  const { db, outputFilePath } = options

  const userList = await retrieveUserList({ db })
  const streamList = await retrieveStreamList({ db })
  const pointList = await retrieveAllPointList({ db })

  const userRecord = userList.reduce((acc, user) => {
    acc[user.id] = user
    return acc
  }, {} as Record<string, User>)

  const streamRecord = streamList.reduce((acc, stream) => {
    acc[stream.id] = stream
    return acc
  }, {} as Record<string, Stream>)

  const pointRecord = pointList.reduce((acc, point) => {
    acc[point.id] = point
    return acc
  }, {} as Record<string, Point>)

  const doc = createDocWithData({ user: userRecord, stream: streamRecord, point: pointRecord })

  const byteArray = saveDoc(doc)
  await fs.writeFile(outputFilePath, byteArray)
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
    const db = await getDb()
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

  for (const stream of Object.values(doc.stream)) {
    const pointList = Object.values(doc.point).filter(
      (point) => point.streamId === stream.id,
    )
    console.log(
      `Stream ${stream.id}: ${stream.name} (${pointList.length} points)`,
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
    const db = await getDb()
    await restoreHandler({ db, inputFilePath })
  })

const automergeCmd = new CliCommand('automerge')
  .withDescription('Experiment with CRDTs')
  .withSubCommands(dumpCmd, restoreCmd)
  .withHandler(async () => {
    automergeCmd.help()
  })

export { automergeCmd }
