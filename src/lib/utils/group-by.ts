const groupBy = <T>(
  list: readonly T[],
  getKey: (item: T) => string,
): Record<string, T[]> => {
  const record: Record<string, T[]> = {}

  for (const item of list) {
    const key = getKey(item)
    const existingList = record[key]
    if (existingList) {
      existingList.push(item)
    } else {
      record[key] = [item]
    }
  }

  return record
}

export { groupBy }
