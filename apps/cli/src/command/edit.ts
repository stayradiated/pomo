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
import {
  getUserTimeZone,
  getPointStartedAtByRef,
  getStreamList,
  getLabelNameById,
  retrieveCurrentPoint,
  updatePoint,
  upsertPoint,
  upsertStream,
  upsertLabel,
} from '@stayradiated/pomo-doc'
import type { Doc } from '@stayradiated/pomo-doc'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const getCurrentText = (
  doc: Doc,
  currentTime: number,
  timeZone: string,
): string => {
  let output = `${formatInTimeZone(
    currentTime,
    timeZone,
    'yyyy-MM-dd HH:mm:ss zzz',
  )}\n\n`

  const streamList = getStreamList({ doc })
  for (const stream of streamList) {
    output += `# ${stream.name}\n\n`

    const currentPoint = retrieveCurrentPoint({
      doc,
      streamId: stream.id,
      currentTime,
    })

    if (currentPoint) {
      const labelNames = currentPoint.labelIdList.map((labelId) => {
        return getLabelNameById({ doc, labelId })
      })
      if (labelNames.length > 0) {
        output += `> ${labelNames.join(', ')}\n\n`
      }

      if (currentPoint.value.length > 0) {
        output += `${currentPoint.value}\n\n`
      }
    } else {
      output += '\n\n'
    }
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
  doc: Doc
  currentTime: number
  timeZone: string
}

const handler = async (options: EditOptions): Promise<void | Error> => {
  const { doc, currentTime, timeZone } = options

  const pleaseEditThisText = getCurrentText(doc, currentTime, timeZone)

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

  for (const item of userInput) {
    const streamName = item.heading
    const streamId = upsertStream({ doc, name: streamName })

    const labelIdList = item.labels.map((label) =>
      upsertLabel({ doc, streamId, name: label }),
    )
    const value = item.text

    const currentPoint = retrieveCurrentPoint({
      doc,
      streamId,
      currentTime,
    })

    const hasSameValue = (currentPoint?.value ?? '') === value
    const hasSameLabelIdList =
      JSON.stringify(currentPoint?.labelIdList ?? []) ===
      JSON.stringify(labelIdList)

    if (!hasSameValue || !hasSameLabelIdList) {
      console.log(
        `[${formatInTimeZone(
          currentTime,
          timeZone,
          'HH:mm',
        )}] ${streamName} → [${item.labels.join(', ')}] ${stripComments(
          value,
        )}`,
      )

      const result =
        currentPoint?.startedAt === currentTime
          ? updatePoint({ doc, pointId: currentPoint.id, value, labelIdList })
          : upsertPoint({
              doc,
              streamId,
              value,
              labelIdList,
              startedAt: currentTime,
            })

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
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const timeZone = getUserTimeZone({ doc })

    const currentTime = options['ref']
      ? getPointStartedAtByRef({ doc, ref: options['ref'] })
      : options['at']
      ? chrono
          .parseDate(options['at'], {
            instant: new Date(),
            timezone: timeZone,
          })
          .getTime()
      : Date.now()
    if (currentTime === undefined) {
      throw new TypeError('Could not figure out current time')
    }

    const result = await handler({ doc, currentTime, timeZone })
    if (result instanceof Error) {
      throw result
    }

    await saveDoc()
  })

export { editCmd }
