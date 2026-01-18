import type { Doc } from './types.js'
import { head } from './utils/head.js'

type GetUserTimeZoneOptions = {
  doc: Doc
}

const getUserTimeZone = (options: GetUserTimeZoneOptions): string => {
  const { doc } = options

  const userMap = doc.getMap('user')

  const user = head(userMap.values())

  return user?.get('timeZone') ?? 'UTC'
}

export { getUserTimeZone }
