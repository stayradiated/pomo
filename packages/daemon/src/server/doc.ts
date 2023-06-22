import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { loadDoc, createDoc } from '@stayradiated/pomo-doc'
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

const setDoc = async (doc: AutomergeDoc) => {
  ref.doc = doc
}

export { getDoc, setDoc }
