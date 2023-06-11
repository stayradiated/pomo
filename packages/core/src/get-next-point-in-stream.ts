import type { Point } from './types.js'

// List must be pre-sorted by startedAt, but list may contain different streams
const getNextPointInStream = <T extends Point>(
  list: T[],
  value: T,
): T | undefined | Error => {
  const filteredList = list.filter((item) => item.streamId === value.streamId)

  const index = filteredList.findIndex((item) => item.id === value.id)
  if (index === -1) {
    return new Error('Could not find value in list!')
  }

  const nextPoint = filteredList[index + 1]
  if (!nextPoint) {
    return undefined
  }

  return nextPoint
}

export { getNextPointInStream }
