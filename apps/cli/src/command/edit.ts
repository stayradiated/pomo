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
import { formatInTimeZone } from 'date-fns-tz'
import { proxy } from '#src/lib/proxy.js'
import { saveDoc } from '#src/lib/doc.js'

const getCurrentText = async (
  currentTime: number,
  timeZone: string,
): Promise<string | Error> => {
  let output = `${formatInTimeZone(
    currentTime,
    timeZone,
    'yyyy-MM-dd HH:mm:ss zzz',
  )}\n\n`

  const streamList = await proxy.retrieveStreamList({})
  if (streamList instanceof Error) {
    return streamList
  }

  for (const stream of streamList) {
    output += `# ${stream.name}\n\n`

    const currentPoint = await proxy.retrieveCurrentPoint({
      streamId: stream.id,
      currentTime,
    })
    if (currentPoint instanceof Error) {
      return currentPoint
    }

    output += currentPoint ? currentPoint.value + '\n\n' : '\n\n'
  }

  return output
}

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
  currentTime: number
  timeZone: string
}

const handler = async (options: EditOptions): Promise<void | Error> => {
  const { currentTime, timeZone } = options

  const pleaseEditThisText = await getCurrentText(currentTime, timeZone)
  if (pleaseEditThisText instanceof Error) {
    return pleaseEditThisText
  }

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
    const result = await proxy.upsertStream({ name: streamName })
    if (result instanceof Error) {
      return result
    }
  }

  for (const [streamName, value] of Object.entries(userInput)) {
    const streamId = await proxy.getStreamIdByName({ name: streamName })
    if (streamId instanceof Error) {
      return streamId
    }

    if (streamId === undefined) {
      throw new TypeError(`Could not find stream with name "${streamName}"`)
    }

    const currentPoint = await proxy.retrieveCurrentPoint({
      streamId,
      currentTime,
    })
    if (currentPoint instanceof Error) {
      return currentPoint
    }

    if (currentPoint?.value !== value) {
      console.log(
        `[${formatInTimeZone(
          currentTime,
          timeZone,
          'HH:mm',
        )}] ${streamName} → ${stripComments(value)}`,
      )

      const result =
        currentPoint?.startedAt === currentTime
          ? await proxy.updatePointValue({ pointId: currentPoint.id, value })
          : await proxy.upsertPoint({ streamId, value, startedAt: currentTime })

      if (result instanceof Error) {
        return result
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
    const timeZone = await proxy.getUserTimeZone({})
    if (timeZone instanceof Error) {
      throw timeZone
    }

    const currentTime = options['ref']
      ? await proxy.getPointStartedAtByRef({ ref: options['ref'] })
      : options['at']
      ? chrono
          .parseDate(options['at'], {
            instant: new Date(),
            timezone: timeZone,
          })
          .getTime()
      : Date.now()

    if (currentTime instanceof Error) {
      throw currentTime
    }

    if (currentTime === undefined) {
      throw new TypeError('Could not figure out current time')
    }

    const result = await handler({ currentTime, timeZone })
    if (result instanceof Error) {
      throw result
    }

    await saveDoc()
  })

export { editCmd }
