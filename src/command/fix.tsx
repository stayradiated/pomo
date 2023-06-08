import React from 'react'
import { render } from 'ink'
import { parseISO, format } from 'date-fns'
import SelectInput from 'ink-select-input'
import type { KyselyDb } from '#src/core/db.js'

type FixProps = {
  list: Date[]
}

type ListItem = {
  label: string
  value: Date
}

const Fix = (props: FixProps) => {
  const { list } = props

  const items: ListItem[] = list.map((startedAt: Date) => {
    const date = format(startedAt, 'HH:mm')
    return { label: date, value: startedAt }
  })

  const handleSelect = (item: ListItem) => {
    console.log(item)
  }

  return <SelectInput items={items} onSelect={handleSelect} />
}

type FixCmdProps = {
  db: KyselyDb
}

const fixCmd = async (props: FixCmdProps) => {
  const { db } = props

  const rows = await db
    .selectFrom('Point')
    .select(['startedAt'])
    .distinct()
    .orderBy('startedAt', 'desc')
    .limit(10)
    .execute()

  const startedAtList = rows.map((row: any) => parseISO(row.startedAt))

  render(<Fix list={startedAtList} />)
}

export { fixCmd }
