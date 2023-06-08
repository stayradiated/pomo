import * as process from 'node:process'
import meow from 'meow'
import z from 'zod'
import * as chrono from 'chrono-node'
import { createKyselyDb } from '#src/core/db.js'
import { edit } from '#src/command/edit.js'
import { logCmd } from '#src/command/log.js'
import { fixCmd } from '#src/command/fix.js'
import { statsCmd } from '#src/command/stats.js'

const cli = meow(
  `
Usage
$ pomo <command>

Options
--at  Set the current time. Defaults to the current time.
`,
  {
    importMeta: import.meta,
    flags: {
      at: {
        type: 'string',
      },
      stream: {
        type: 'string',
      },
    },
  },
)

const command = cli.input[0] ?? 'edit'

const env = z
  .object({
    POMO_DATABASE_URL: z.string(),
  })
  .parse(process.env)

const db = createKyselyDb(env.POMO_DATABASE_URL)

const currentTime = cli.flags.at ? chrono.parseDate(cli.flags.at) : new Date()

const main = async (): Promise<void | Error> => {
  switch (command) {
    case 'fix': {
      return fixCmd({ db })
    }

    case 'edit': {
      return edit({ db, currentTime })
    }

    case 'log': {
      return logCmd({
        db,
        filter: { streamName: cli.flags.stream },
        currentTime,
      })
    }

    case 'stats': {
      return statsCmd({
        db,
        filter: { streamName: cli.flags.stream },
        currentTime,
      })
    }
  }
}

const error = await main()
if (error instanceof Error) {
  throw error
}
