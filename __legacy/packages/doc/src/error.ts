class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

class MultipleFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MultipleFoundError'
  }
}

export { NotFoundError, MultipleFoundError }
