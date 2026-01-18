import { hash, verify } from '@node-rs/argon2'

const v0x13 = 1

interface PasswordHashingAlgorithm {
  hash(password: string): Promise<string>
  verify(hash: string, password: string): Promise<boolean>
}

class Argon2id implements PasswordHashingAlgorithm {
  constructor(options?: {
    memorySize?: number
    iterations?: number
    tagLength?: number
    parallelism?: number
    secret?: Buffer
  }) {
    this.memorySize = options?.memorySize ?? 19456
    this.iterations = options?.iterations ?? 2
    this.tagLength = options?.tagLength ?? 32
    this.parallelism = options?.parallelism ?? 1
    this.secret = options?.secret ?? undefined
  }

  private memorySize?: number
  private iterations?: number
  private tagLength?: number
  private parallelism?: number
  private secret: Buffer | undefined

  public async hash(password: string): Promise<string> {
    return await hash(password.normalize('NFKC'), {
      memoryCost: this.memorySize,
      timeCost: this.iterations,
      outputLen: this.tagLength,
      parallelism: this.parallelism,
      version: v0x13,
      secret: this.secret,
    })
  }

  public async verify(hash: string, password: string): Promise<boolean> {
    return await verify(hash, password.normalize('NFKC'), {
      memoryCost: this.memorySize,
      timeCost: this.iterations,
      outputLen: this.tagLength,
      parallelism: this.parallelism,
      version: v0x13,
      secret: this.secret,
    })
  }
}

export { Argon2id }
