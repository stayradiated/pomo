import { CliCommand } from 'cilly'
import {
  getPointList,
  getLabelRecord,
  getStreamRecord,
  updateLabel,
  transact,
} from '@stayradiated/pomo-doc'
import type { Label } from '@stayradiated/pomo-doc'
import {
  mapPointListToLineList,
  mapLineListToVerboseSliceList,
} from '@stayradiated/pomo-core'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const migrateCmd = new CliCommand('migrate')
  .withDescription('Migrate schema of document')
  .withHandler(async () => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const labelRecord = getLabelRecord({ doc })
    const streamRecord = getStreamRecord({ doc })

    const pointList = getPointList({ doc })
    const lineList = mapPointListToLineList(pointList)
    if (lineList instanceof Error) {
      throw lineList
    }

    const sliceList = mapLineListToVerboseSliceList(lineList)

    const labelParentMap = new Map<Label, Label>()

    for (const slice of sliceList) {
      const { lineList } = slice

      lineList.sort((a, b) => {
        const aStreamIndex = streamRecord[a.streamId]?.index ?? 0
        const bStreamIndex = streamRecord[b.streamId]?.index ?? 0
        return aStreamIndex - bStreamIndex
      })

      lineList.map((line) => {
        const stream = streamRecord[line.streamId]

        const streamParentId = stream?.parentId
        if (typeof streamParentId !== 'string') {
          return
        }

        const labelList = line.labelIdList
          .map((labelId) => labelRecord[labelId])
          .filter((label): label is Label => {
            return label !== undefined
          })

        const parentLabelList =
          lineList
            .find((l) => l.streamId === streamParentId)
            ?.labelIdList.map((labelId) => labelRecord[labelId])
            .filter((label): label is Label => {
              return label !== undefined
            }) ?? []
        if (parentLabelList.length > 1) {
          throw new Error('Parent label list is too long')
        }

        for (const label of labelList) {
          const parentLabel = parentLabelList[0]
          if (!parentLabel) {
            continue
          }

          if (labelParentMap.has(label)) {
            const existingParentLabel = labelParentMap.get(label)!
            if (existingParentLabel.id !== parentLabel.id) {
              console.error(
                `❌ ${label.name} | ${existingParentLabel.name} | ${parentLabel.name} |`,
              )
            }
          } else if (label.parentId === null) {
            labelParentMap.set(label, parentLabel)
          } else if (label.parentId !== parentLabel.id) {
            const existingParentLabel = labelRecord[label.parentId]!
            console.error(
              `❌ ${label.name} | ${existingParentLabel.name} | ${parentLabel.name} |`,
            )
          }
        }
      })
    }

    transact(doc, () => {
      for (const [label, parentLabel] of labelParentMap.entries()) {
        console.log(`✅ ${label.name} → ${parentLabel.name}`)
        const result = updateLabel({
          doc,
          labelId: label.id,
          parentId: parentLabel.id,
        })
        if (result instanceof Error) {
          throw result
        }
      }
    })

    await saveDoc()
  })

export { migrateCmd }
