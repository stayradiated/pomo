import { CliCommand } from 'cilly'
import * as chrono from 'chrono-node'
import {
  ExternalEditor,
  CreateFileError,
  ReadFileError,
  RemoveFileError,
  LaunchEditorError,
} from 'external-editor'
import { parse } from '@stayradiated/pomo-markdown'
import { stripComments } from '@stayradiated/pomo-core'
import type { KyselyDb } from '@stayradiated/pomo-db'
import {
  retrieveStreamList,
  retrieveCurrentPoint,
  getStreamIdByName,
  getPointStartedAtByRef,
  updatePointValue,
  insertPoint,
  upsertStream,
  getUserTimeZone,
} from '@stayradiated/pomo-db'
import { formatInTimeZone } from 'date-fns-tz'
import { getDb } from '#src/lib/db.js'

// # edit current streams
//
// A "stream" is defined as something that you can only have one value at a time.
// For example, you can only be in one place at a time, so "location" is a stream.
// Another example is that you can only be working on one task at a time, so "task" is a stream.
// You may be working on multiple projects during the day, but you can only be working on one project at a time, so "project" is a stream.
//
// Streams are defined using a text document formatted with markdown.
// This allows for easy editing and extensibility.
//
// Each stream is defined by a header, which is a markdown header (e.g. `#` or `##`).

type EditOptions = {
  db: KyselyDb
  currentTime: number
  timeZone: string
}

const handler = async (options: EditOptions) => {
  const { db, currentTime, timeZone } = options

  const getCurrentText = async (): Promise<string> => {
    let output = `${formatInTimeZone(
      currentTime,
      timeZone,
      'yyyy-MM-dd HH:mm:ss zzz',
    )}\n\n`

    const streamList = await retrieveStreamList({ db })

    for (const stream of streamList) {
      output += `# ${stream.name}\n\n`

      const currentPoint = await retrieveCurrentPoint({
        db,
        streamId: stream.id,
        currentTime,
      })

      output += currentPoint ? currentPoint.value + '\n\n' : '\n\n'
    }

    return output
  }

  const pleaseEditThisText = await getCurrentText()

  const editor = new ExternalEditor(pleaseEditThisText, {
    postfix: '.md',
  })

  try {
    editor.run()
    if (editor.lastExitStatus !== 0) {
      console.log('The editor exited with a non-zero code')
    }
  } catch (error: unknown) {
    if (error instanceof CreateFileError) {
      console.log('Failed to create the temporary file')
    } else if (error instanceof ReadFileError) {
      console.log('Failed to read the temporary file')
    } else if (error instanceof LaunchEditorError) {
      console.log('Failed to launch your editor')
    } else {
      throw error
    }
  }

  const userInput = parse(editor.text)

  const streamNameList = Object.keys(userInput)
  for (const streamName of streamNameList) {
    await upsertStream({ db, name: streamName })
  }

  for (const [streamName, value] of Object.entries(userInput)) {
    const streamId = await getStreamIdByName({ db, name: streamName })
    if (streamId instanceof Error) {
      throw streamId
    }

    const currentPoint = await retrieveCurrentPoint({
      db,
      streamId,
      currentTime,
    })

    if (currentPoint?.value !== value) {
      console.log(
        `[${formatInTimeZone(
          currentTime,
          timeZone,
          'HH:mm',
        )}] ${streamName} → ${stripComments(value)}`,
      )

      if (currentPoint?.startedAt === currentTime) {
        await updatePointValue({
          db,
          pointId: currentPoint.id,
          value,
        })
      } else {
        await insertPoint({
          db,
          streamId,
          value,
          startedAt: currentTime,
        })
      }
    }
  }

  // Eventually call the cleanup to remove the temporary file
  try {
    editor.cleanup()
  } catch (error) {
    if (error instanceof RemoveFileError) {
      console.log('Failed to remove the temporary file')
    } else {
      throw error
    }
  }
}

const editCmd = new CliCommand('edit')
  .withDescription('Edit current streams')
  .withOptions(
    {
      name: ['-a', '--at'],
      description: 'Edit status at a current time',
      args: [
        {
          name: 'datetime',
          description: 'Date/time to show points from',
          required: true,
        },
      ],
    },
    {
      name: ['-r', '--ref'],
      description: 'Edit points for an existing slice',
      args: [
        {
          name: 'sliceId',
          description: 'ID of the slice to edit',
          required: true,
        },
      ],
    },
  )
  .withHandler(async (_args, options, _extra) => {
    const db = getDb()

    const timeZone = await getUserTimeZone({ db })

    const currentTime = options['ref']
      ? await getPointStartedAtByRef({ db, ref: options['ref'] })
      : options['from']
      ? chrono
          .parseDate(options['from'], {
            instant: new Date(),
            timezone: timeZone,
          })
          .getTime()
      : Date.now()

    if (currentTime instanceof Error) {
      throw currentTime
    }

    await handler({ db, currentTime, timeZone })
  })

export { editCmd }
