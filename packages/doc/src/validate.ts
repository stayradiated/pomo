import type { ZodIssue } from 'zod'
import { $JsonDoc } from './schema.js'
import type { Doc } from './types.js'

type ValidateOptions = {
  doc: Doc
}

const validate = (options: ValidateOptions): void | ZodIssue[] => {
  const { doc } = options

  const result = $JsonDoc.safeParse({
    label: doc.getMap('label').toJSON(),
    point: doc.getMap('point').toJSON(),
    stream: doc.getMap('stream').toJSON(),
    user: doc.getMap('user').toJSON(),
  })

  if (!result.success) {
    return result.error.issues
  }

  return undefined
}

export { validate }
