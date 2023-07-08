import { CliCommand } from 'cilly'
import { getDoc, saveDoc} from '#src/lib/doc.js'
import { getLabelList, updateLabel } from '@stayradiated/pomo-doc'
import getEmojiRegex from 'emoji-regex'

const migrateCmd = new CliCommand('migrate')
  .withDescription('Migrate schema of document')
  .withHandler(async () => {
    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    // const pointList = getPointList({ doc })
    // const lineList = mapPointListToLineList(pointList)
    // if (lineList instanceof Error) {
    //   throw lineList
    // }
    //
    // const sliceList = mapLineListToSliceList(lineList)
    //
    // console.log(JSON.stringify(sliceList, null, 2))
    //
    //
    //
    const labelList = getLabelList({ doc })

    for (const label of labelList) {
      const { name, icon } = label

      if (icon !== null) {
        continue
      }

      const emojiRegex = getEmojiRegex()
      const match = emojiRegex.exec(name)
      if (match) {
        const emoji = match[0]
        const index = match.index
        const nameWithoutEmoji = name.slice(0, index) + name.slice(index + emoji.length)
        updateLabel({ doc, labelId: label.id, name: nameWithoutEmoji, icon: emoji })
      }
    }

    await saveDoc()
  })

export { migrateCmd }
