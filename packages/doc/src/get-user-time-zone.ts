import type { AutomergeDoc } from './types.js'

type GetUserTimeZoneOptions = {
  doc: AutomergeDoc
}

const getUserTimeZone = async (
  options: GetUserTimeZoneOptions,
): Promise<string> => {
  const { doc } = options
  const user = doc.user[0]

  if (!user) {
    return 'UTC'
  }

  return user.timeZone
}

export { getUserTimeZone }
