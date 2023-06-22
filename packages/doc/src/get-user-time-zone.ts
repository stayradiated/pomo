import type { AutomergeDoc } from './types.js'

type GetUserTimeZoneOptions = {
  doc: AutomergeDoc
}

const getUserTimeZone = (options: GetUserTimeZoneOptions): string => {
  const { doc } = options

  const user = Object.values(doc.user)[0]

  if (!user) {
    return 'UTC'
  }

  return user.timeZone
}

export { getUserTimeZone }
