import type { Doc, User } from './types.js'

type GetOptions = {
  doc: Doc
}

const getUserList = (options: GetOptions): User[] => {
  const { doc } = options

  const userMap = doc.getMap('user')
  const userList = Object.values(userMap.toJSON()) as User[]

  return userList
}

export { getUserList }
