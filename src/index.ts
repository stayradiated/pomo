#!/usr/bin/env node

import * as process from 'node:process'
import meow from 'meow'
import z from 'zod'
import { createKyselyDb } from './db.js'
import { edit } from './edit.js'
import { logCmd } from './log.js'

const cli = meow(
  `
Usage
$ pomo <command>
`,
  {
    importMeta: import.meta,
    flags: {},
  },
)

const command = cli.input[0] ?? 'edit'

const env = z
  .object({
    POMO_DATABASE_URL: z.string(),
  })
  .parse(process.env)

const db = createKyselyDb(env.POMO_DATABASE_URL)

const main = async () => {
  switch (command) {
    case 'edit': {
      return edit(db)
    }
    case 'log': {
      return logCmd(db)
    }
  }
}

await main()
