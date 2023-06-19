import * as fs from 'node:fs/promises'
import { CliCommand } from 'cilly'
import type { KyselyDb } from '@stayradiated/pomo-db'
import * as Automerge from '@automerge/automerge'
import type { Point, Stream } from '@stayradiated/pomo-core'
import { retrieveStreamList, retrieveAllPointList } from '@stayradiated/pomo-db'
import { getDb } from '#src/lib/db.js'

type Doc = {
  pointList: Point[]
  streamList: Stream[]
}

const createDoc = () => {
  const schema = Automerge.change(
    Automerge.init<Doc>('0000'),
    { time: 0 },
    (doc) => {
      doc.pointList = [] as unknown as Automerge.List<Point>
      doc.streamList = [] as unknown as Automerge.List<Stream>
    },
  )

  const initChange = Automerge.getLastLocalChange(schema)
  const [doc] = Automerge.applyChanges(Automerge.init<Doc>(), [initChange])

  return doc
}

type DumpHandlerOptions = {
  db: KyselyDb
  outputFilePath: string
}

const dumpHandler = async (options: DumpHandlerOptions) => {
  const { db, outputFilePath } = options

  const streamList = await retrieveStreamList({ db })
  const pointList = await retrieveAllPointList({ db })

  const doc = Automerge.change(createDoc(), (doc) => {
    doc.streamList.push(...streamList)
    doc.pointList.push(...pointList)
  })

  const byteArray = Automerge.save(doc)

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
  const doc = Automerge.load<Doc>(byteArray)

  for (const stream of doc.streamList) {
    const pointList = doc.pointList.filter(
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
