import * as fs from 'node:fs/promises'
import { fromUnixTime } from 'date-fns'
import z from 'zod'

const $WatsonFrame = z.tuple([
  z.number(), // Start
  z.number(), // Stop
  z.string(), // Project
  z.string(), // Id
  z.array(z.string()), // Tags
  z.number(), // UpdatedAt
])
const $WatsonFrameList = z.array($WatsonFrame)

type Frame = {
  start: Date
  stop: Date
  project: string
  id: string
  tags: string[]
  updatedAt: Date
}

const readWatsonFrames = async (filePath: string): Promise<Frame[]> => {
  const contentJSON = await fs.readFile(filePath, 'utf8')
  const content = $WatsonFrameList.parse(JSON.parse(contentJSON))
  const frameList = content.map((watsonFrame) => ({
    start: fromUnixTime(watsonFrame[0]),
    stop: fromUnixTime(watsonFrame[1]),
    project: watsonFrame[2],
    id: watsonFrame[3],
    tags: watsonFrame[4],
    updatedAt: fromUnixTime(watsonFrame[5]),
  }))
  return frameList
}

const dedupe = <T>(array: T[]): T[] => [...new Set(array)]

const dumpTags = (frameList: Frame[]): string => {
  const projectList = dedupe(frameList.map((frame) => frame.project))
  const dump = projectList.map((project) => {
    const projectFrames = frameList.filter((frame) => frame.project === project)
    const tags = dedupe(projectFrames.flatMap((frame) => frame.tags))
    return { project, tags }
  })
  return JSON.stringify(dump)
}

// Const transformFrame = (frame: Frame): Record<string, string> => {
//   switch (frame.project) {
//     case 'snapchat-upgrade': {
//       return {
//         company: 'Mish Guru',
//         project: 'Snapchat Upgrade',
//       }
//     }
//
//     case 'meeting': {
//       return {
//         company: 'Mish Guru',
//         project: 'Meeting',
//       }
//     }
//   }
// }

export { readWatsonFrames, dumpTags }
