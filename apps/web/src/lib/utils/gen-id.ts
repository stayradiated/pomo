import id128 from 'id128'

const genId = <T extends string = string>(now: number = Date.now()): T => {
  return id128.Ulid.generate({ time: now }).toCanonical() as T
}

export { genId }
