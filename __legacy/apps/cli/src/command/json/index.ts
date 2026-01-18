import { CliCommand } from 'cilly'
import { exportAsJson } from './export.js'
import { importFromJson } from './import.js'

const importCmd = new CliCommand('import')
  .withDescription('Create a new pomo state from a JSON document')
  .withOptions(
    {
      name: ['-i', '--in-file'],
      description: 'Path to JSON file',
      args: [{ name: 'file', required: true }],
    },
    {
      name: ['-o', '--out-file'],
      description: 'Where to write the pomo state file',
      args: [{ name: 'file', required: true }],
    },
  )
  .withHandler(async (_args, options) => {
    const { inFile: srcFilePath, outFile: destFilePath } = options
    const result = await importFromJson({ srcFilePath, destFilePath })
    if (result instanceof Error) {
      throw result
    }

    console.info(`Converted ${srcFilePath} to ${destFilePath}`)
  })

const exportCmd = new CliCommand('export')
  .withDescription('Export data as JSON document')
  .withHandler(async () => {
    const result = await exportAsJson()
    if (result instanceof Error) {
      throw result
    }
  })

const jsonCmd = new CliCommand('json')
  .withDescription('Import & Export data to/from JSON')
  .withSubCommands(importCmd, exportCmd)
  .withHandler(async () => {
    jsonCmd.help()
  })

export { jsonCmd }
