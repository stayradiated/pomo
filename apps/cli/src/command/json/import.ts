import * as fs from 'node:fs/promises'
import {
  $JsonDoc,
  createDocWithData,
  encodeStateAsUpdate,
} from '@stayradiated/pomo-doc'

type ImportFromJsonOptions = {
  srcFilePath: string
  destFilePath: string
}

const importFromJson = async (
  options: ImportFromJsonOptions,
): Promise<undefined | Error> => {
  const { srcFilePath, destFilePath } = options

  const content = await fs.readFile(srcFilePath, 'utf8')
  const rawJsonDoc = JSON.parse(content)
  const jsonDoc = $JsonDoc.parse(rawJsonDoc)

  const doc = createDocWithData(jsonDoc)

  const byteArray = encodeStateAsUpdate(doc)
  await fs.writeFile(destFilePath, byteArray)

  return
}

export { importFromJson }
