import { createKyselyDb, retrieveStreamList, retrievePointList } from "@stayradiated/pomo-db"
import createSqliteDb from 'better-sqlite3'
import { assertOk } from '@stayradiated/error-boundary'
import { env } from './env.js'

const db = createKyselyDb(createSqliteDb(env.POMO_DATABASE_URL))

const streamList = await retrieveStreamList({ db })

const pointListOrError = await retrievePointList({
  db,
  since: new Date('2023-06-01'),
  filter: {}
})
assertOk(pointListOrError)
const pointList = pointListOrError

export { streamList, pointList }
export { db }

