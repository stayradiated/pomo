import type { Line, Slice } from './types.js'

// List must be pre-sorted by startedAt, but list may contain different streams
const mapLineListToVerboseSliceList = (lineList: Line[]): Slice[] => {
  const sliceList: Slice[] = []

  let currentSlice: Slice | undefined
  for (const line of lineList) {
    const timestamp = line.startedAt
    if (timestamp !== currentSlice?.startedAt) {
      const previousSlice = currentSlice
      currentSlice = {
        startedAt: timestamp,
        lineList: previousSlice ? [...previousSlice.lineList] : [],
      }
      sliceList.push(currentSlice)
    }

    for (let i = 0, length = currentSlice.lineList.length; i < length; i += 1) {
      if (currentSlice.lineList[i]?.streamId === line.streamId) {
        currentSlice.lineList.splice(i, 1)
        break
      }
    }

    currentSlice.lineList.push(line)
  }

  return sliceList
}

export { mapLineListToVerboseSliceList }
