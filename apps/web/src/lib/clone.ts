const cloneObject = <T extends Object>(object: T): T => {
  return {...object}
}

const cloneList = <T extends Object>(list: T[]): T[] => {
  return list.map(cloneObject)
}

const cloneMap = <K, V extends Object>(map: Map<K, V>): Map<K, V> => {
  return new Map([...map.entries()].map(([key, value]) => {
    return [key, cloneObject(value)]
  }))
}

export { cloneObject, cloneList, cloneMap }
