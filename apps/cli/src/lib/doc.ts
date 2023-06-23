import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as pomoDoc from '@stayradiated/pomo-doc'
import type { Doc } from '@stayradiated/pomo-doc'
import { errorBoundary } from '@stayradiated/error-boundary'
import { getEnv } from './env.js'

type GetDocFn = () => Promise<Doc | Error>

type Ref = {
  doc: Doc | undefined
}

const ref: Ref = {
  doc: undefined,
}

const getDoc: GetDocFn = async (): Promise<Doc | Error> => {
  if (ref.doc) {
    return ref.doc
  }

  const env = getEnv()

  const inputFilePath = path.join(env.POMO_DIR, 'state')

  const exists = await errorBoundary(async () => fs.stat(inputFilePath))
  if (exists instanceof Error && 'code' in exists) {
    if (exists.code === 'ENOENT') {
      console.log('Creating new doc')
      return pomoDoc.createDoc()
    }

    return exists
  }

  console.time('readFile')
  const byteArray = await fs.readFile(inputFilePath)
  console.timeEnd('readFile')

  console.time('loadDoc')
  const doc = pomoDoc.loadDoc(byteArray)
  console.timeEnd('loadDoc')

  ref.doc = doc

  return doc
}

const saveDoc = async () => {
  const doc = ref.doc
  if (!doc) {
    throw new Error('No doc')
  }

  const byteArray = pomoDoc.saveDoc(doc)
  const filePath = path.join(getEnv().POMO_DIR, 'state')
  await fs.writeFile(filePath, byteArray)
}

export { getDoc, saveDoc }
