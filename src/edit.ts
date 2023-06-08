import {
  ExternalEditor,
  CreateFileError,
  ReadFileError,
  RemoveFileError,
  LaunchEditorError,
} from 'external-editor'
import { format } from 'date-fns'
import { parse } from './parse.js'
import type { KyselyDb } from './db.js'
import { stripComments } from './text.js'

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
  currentTime: Date
}

const edit = async (options: EditOptions) => {
  const { db, currentTime } = options

  const getCurrentText = async (): Promise<string> => {
    let output = `${currentTime.toISOString()}\n\n`

    const streamList = await db
      .selectFrom('Stream')
      .select(['id', 'name'])
      .execute()

    for (const stream of streamList) {
      output += `# ${stream.name}\n\n`

      const currentStreamValue = await db
        .selectFrom('StreamValue')
        .select(['value'])
        .where('streamId', '=', stream.id)
        .where('startedAt', '<=', currentTime.toISOString())
        .orderBy('startedAt', 'desc')
        .executeTakeFirst()

      output += currentStreamValue ? currentStreamValue.value + '\n\n' : '\n\n'
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
    await db
      .insertInto('Stream')
      .values({ name: streamName })
      .onConflict((oc) => oc.column('name').doNothing())
      .execute()
  }

  for (const [streamName, value] of Object.entries(userInput)) {
    const stream = await db
      .selectFrom('Stream')
      .select('id')
      .where('name', '=', streamName)
      .executeTakeFirstOrThrow()

    const currentStreamValue = await db
      .selectFrom('StreamValue')
      .select(['id', 'value', 'startedAt'])
      .where('streamId', '=', stream.id)
      .where('startedAt', '<=', currentTime.toISOString())
      .orderBy('startedAt', 'desc')
      .executeTakeFirst()

    if (currentStreamValue?.value !== value) {
      const updatedAt = new Date().toISOString()

      console.log(
        `[${format(currentTime, 'HH:mm')}] ${streamName} → ${stripComments(
          value,
        )}`,
      )

      if (currentStreamValue?.startedAt === currentTime.toISOString()) {
        await db
          .updateTable('StreamValue')
          .set({ value, updatedAt })
          .where('id', '=', currentStreamValue.id)
          .execute()
      } else {
        await db
          .insertInto('StreamValue')
          .values({
            streamId: stream.id,
            value,
            startedAt: currentTime.toISOString(),
          })
          .execute()
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

export { edit }
