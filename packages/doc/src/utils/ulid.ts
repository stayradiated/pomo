import { Ulid } from 'id128';

const randomUlid = (): string => {
  return Ulid.generate().toCanonical()
}

export { randomUlid }
