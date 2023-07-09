import type { Line, Slice } from './types.js'

// List must be pre-sorted by startedAt, but list may contain different streams
const mapLineListToSliceList = (lineList: Line[]): Slice[] => {
  const sliceList: Slice[] = []

  let previousSlice: Slice | undefined
  for (const line of lineList) {
    const timestamp = line.startedAt
    if (timestamp === previousSlice?.startedAt) {
      previousSlice.lineList.push(line)
    } else {
      const slice = {
        startedAt: timestamp,
        lineList: [line],
      }
      sliceList.push(slice)
      previousSlice = slice
    }
  }

  return sliceList
}

export { mapLineListToSliceList }
