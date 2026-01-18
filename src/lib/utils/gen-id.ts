import id128 from 'id128'

const genId = <T extends string = string>(now?: number): T => {
  const ulid = id128.UlidMonotonic.generate({ time: now }).toCanonical() as T
  return ulid
}

export { genId }
