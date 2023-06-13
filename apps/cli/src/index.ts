import * as process from 'node:process'
import meow from 'meow'
import z from 'zod'
import * as chrono from 'chrono-node'
import {
  createKyselyDb,
  getPointStartedAtByRef,
  getStreamIdByName,
} from '@stayradiated/pomo-db'
import createSqliteDb from 'better-sqlite3'
import { edit } from '#src/command/edit.js'
import { logCmd } from '#src/command/log.js'
import { summaryCmd } from '#src/command/summary.js'
import { statusCmd } from '#src/command/status.js'
import { migrateCmd } from '#src/command/migrate.js'
import { pullStravaCmd } from '#src/command/pull-strava.js'

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
      ref: {
        type: 'string',
      },
      at: {
        type: 'string',
      },
      stream: {
        type: 'string',
      },
      value: {
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

const db = createKyselyDb(createSqliteDb(env.POMO_DATABASE_URL))

if (cli.flags.at && cli.flags.ref) {
  throw new Error('--at and --ref are mutually exclusive!')
}

const currentTime = cli.flags.ref
  ? await getPointStartedAtByRef({ db, ref: cli.flags.ref })
  : cli.flags.at
  ? chrono.parseDate(cli.flags.at)
  : new Date()
if (currentTime instanceof Error) {
  throw currentTime
}

const filterStreamId = cli.flags.stream
  ? await getStreamIdByName({ db, name: cli.flags.stream })
  : undefined
if (filterStreamId instanceof Error) {
  throw filterStreamId
}

const main = async (): Promise<void | Error> => {
  switch (command) {
    case 'edit': {
      return edit({ db, currentTime })
    }

    case 'log': {
      return logCmd({
        db,
        filter: { streamId: filterStreamId },
        currentTime,
      })
    }

    case 'summary': {
      return summaryCmd({
        db,
        filter: { streamId: filterStreamId, value: cli.flags.value },
        currentTime,
      })
    }

    case 'status': {
      statusCmd({
        db,
        filter: { streamId: filterStreamId },
        currentTime,
      })
      return
    }

    case 'migrate': {
      return migrateCmd({
        db,
      })
    }

    case 'pull-strava': {
      pullStravaCmd({
        db,
      })
    }
  }
}

const error = await main()
if (error instanceof Error) {
  throw error
}
