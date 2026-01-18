import { Argon2id } from './argon2id.js'

const argon2id = new Argon2id()

const cryptoHash = {
  hash: async (input: string): Promise<string> => {
    const passwordHash = await argon2id.hash(input)
    return passwordHash
  },
  verify: async (storedHash: string, input: string): Promise<boolean> => {
    const isValid = await argon2id.verify(storedHash, input)
    return isValid
  },
}

export { cryptoHash }
