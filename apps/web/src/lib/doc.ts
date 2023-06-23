import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { loadDoc, createDoc, saveDoc } from '@stayradiated/pomo-doc'
import type { AutomergeDoc } from '@stayradiated/pomo-doc'
import { errorBoundary } from '@stayradiated/error-boundary'
import { getEnv } from './env.js'

type GetDocFn = () => Promise<AutomergeDoc | Error>

type Ref = {
  doc: AutomergeDoc | undefined
}

const ref: Ref = {
  doc: undefined,
}

const getDoc: GetDocFn = async (): Promise<AutomergeDoc | Error> => {
  if (ref.doc) {
    return ref.doc
  }

  const env = getEnv()

  const inputFilePath = path.join(env.POMO_DIR, 'state')

  const exists = await errorBoundary(async () => fs.stat(inputFilePath))
  if (exists instanceof Error && 'code' in exists) {
    if (exists.code === 'ENOENT') {
      console.log('Creating new doc')
      return createDoc()
    }

    return exists
  }

  const byteArray = await fs.readFile(inputFilePath)
  const doc = loadDoc(byteArray)

  ref.doc = doc

  return doc
}

const saveChanges = async () => {
  const doc = ref.doc
  if (!doc) {
    throw new Error('No doc')
  }

  const byteArray = saveDoc(doc)
  const filePath = path.join(getEnv().POMO_DIR, 'state')
  await fs.writeFile(filePath, byteArray)
}

const setDoc = (doc: AutomergeDoc): AutomergeDoc => {
  ref.doc = doc
  return doc
}

export { getDoc, setDoc, saveChanges }
