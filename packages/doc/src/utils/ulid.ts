import id128 from 'id128'

const randomUlid = (): string => {
  return id128.Ulid.generate().toCanonical()
}

export { randomUlid }
