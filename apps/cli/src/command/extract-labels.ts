import { CliCommand } from 'cilly'
import type { Doc } from '@stayradiated/pomo-doc'
import {
  getPointList,
  upsertLabel,
  upsertPointLabel,
  transact,
} from '@stayradiated/pomo-doc'
import { stripComments, firstLine } from '@stayradiated/pomo-core'
import { listOrError } from '@stayradiated/error-boundary'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const extractLabelsFromQuote = (value: string): string[] => {
  return firstLine(value)
    .replace(/^>\s*/, '')
    .split(', ')
    .map((label) => label.trim())
}

const extractlabelsFromFirstLine = (value: string): string[] => {
  const possibleLabel = firstLine(value)
  if (possibleLabel.length === 0) {
    return []
  }

  const wordCount = possibleLabel.split(' ').length
  if (wordCount >= 5) {
    return []
  }

  return [possibleLabel]
}

const extractLabelsFromValue = (value: string): string[] => {
  if (value.startsWith('>')) {
    return extractLabelsFromQuote(value)
  }

  return extractlabelsFromFirstLine(value)
}

type Options = {
  doc: Doc
}

const extractLabelsFromAllPoints = async (
  options: Options,
): Promise<void | Error> => {
  const { doc } = options

  const pointList = getPointList({ doc })

  for (const point of pointList) {
    const pointValue = stripComments(point.value)

    const labelNameList = extractLabelsFromValue(pointValue)

    console.log(
      `\n• ${pointValue.replaceAll('\n', '↳')}\n→ ${JSON.stringify(
        labelNameList,
      )}`,
    )

    const result = transact(doc, () =>
      listOrError(
        labelNameList.map((labelName) => {
          const labelId = upsertLabel({
            doc,
            streamId: point.streamId,
            name: labelName,
          })
          if (labelId instanceof Error) {
            return labelId
          }

          return upsertPointLabel({ doc, pointId: point.id, labelId })
        }),
      ),
    )
    if (result instanceof Error) {
      return result
    }
  }
}

const extractLabelsCmd = new CliCommand('extract-labels')
  .withDescription('temporary command to extract labels from point values')
  .withHandler(async () => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const result = await extractLabelsFromAllPoints({ doc })
    if (result instanceof Error) {
      throw result
    }

    await saveDoc()
  })

export { extractLabelsCmd }
