import { CliCommand } from 'cilly'
import {
  deleteLabels,
  getLabelByName,
  getPointList,
  getStreamByName,
  transact,
} from '@stayradiated/pomo-doc'
import { confirmDialog } from './confirm-dialog.js'
import { getDoc, saveDoc } from '#src/lib/doc.js'

const deleteCmd = new CliCommand('delete')
  .withDescription('Delete label')
  .withArguments(
    {
      name: 'stream',
      description: 'Name of the stream',
      required: true,
    },
    {
      name: 'label',
      description: 'Name of the label to delete',
      required: true,
    },
  )
  .withHandler(async (args) => {
    const streamName = args['stream']
    const labelName = args['label']

    const doc = await getDoc()
    if (doc instanceof Error) {
      throw doc
    }

    const stream = getStreamByName({ doc, name: streamName })
    if (stream instanceof Error) {
      throw stream
    }

    const label = getLabelByName({ doc, streamId: stream.id, name: labelName })
    if (label instanceof Error) {
      throw label
    }

    const pointList = getPointList({ doc })

    let pointCount = 0
    for (const point of pointList) {
      if (
        point.streamId === stream.id &&
        point.labelIdList.includes(label.id)
      ) {
        pointCount++
      }
    }

    const confirmed = await confirmDialog({
      label,
      pointCount,
    })
    if (!confirmed) {
      return
    }

    const result = transact(doc, () =>
      deleteLabels({ doc, streamId: stream.id, labelIdList: [label.id] }),
    )
    if (result instanceof Error) {
      throw result
    }

    await saveDoc()
  })

export { deleteCmd }
