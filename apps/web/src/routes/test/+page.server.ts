import type { PageServerLoad } from './$types';
import { getEnv } from '$lib/env.js'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { errorBoundary } from '@stayradiated/error-boundary'
import * as pomoDoc from '@stayradiated/pomo-doc'

export const load = (async () => {
  const env = getEnv()
  console.log({ env })

  const inputFilePath = path.join(env.POMO_DIR, 'state')
  console.log({ inputFilePath })

  const exists = await errorBoundary(async () => fs.stat(inputFilePath))
  console.log({ exists })

  const byteArray = await fs.readFile(inputFilePath)
  console.log(byteArray.subarray(0, 10), byteArray.length)

  const doc = pomoDoc.loadDoc(byteArray)

  const point = pomoDoc.getPointById({ doc, id: '1' })
  console.log({ point })

  return {
    secret: 'secret'
  }
}) satisfies PageServerLoad;
