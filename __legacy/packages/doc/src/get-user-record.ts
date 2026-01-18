import type { Doc, User } from './types.js'

type GetOptions = {
  doc: Doc
}

const getUserRecord = (options: GetOptions): Record<string, User> => {
  const { doc } = options

  const userMap = doc.getMap('user')
  const userRecord = userMap.toJSON() as Record<string, User>

  return userRecord
}

export { getUserRecord }
