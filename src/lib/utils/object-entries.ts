type Entry<T> = [keyof T, T[keyof T]]

const objectEntries = <T extends object>(obj: T): Entry<T>[] => {
  return Array.from(Object.entries(obj)) as Entry<T>[]
}

const objectKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Array.from(Object.keys(obj)) as (keyof T)[]
}

export { objectEntries, objectKeys }
