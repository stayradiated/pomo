import { streamList, pointList } from "$lib/data";
import type { Point } from "@stayradiated/pomo-core";
import { parseISO } from 'date-fns'
import type { PageServerLoad, Actions } from './$types';
import { randomUUID } from 'node:crypto'

const getCurrentPoints = (currentTime: Date): Map<string, Point> => {
  const currentPoints = pointList.reduce<Map<string, Point>>((out, point) => {
    // TODO: parsing a date every loop is so inefficient it hurts
    const startedAt = parseISO(point.startedAt)
    if (startedAt.getTime() > currentTime.getTime()) {
      return out
    }

    const previous = out.get(point.streamId)
    if (previous) {
      const previousStartedAt = parseISO(previous.startedAt)
      if (previousStartedAt >= startedAt) {
        return out
      }
    }

    out.set(point.streamId, point)
    return out
  }, new Map())
  return currentPoints
}

const load = (async () => {
  const currentTime = new Date()
  const currentPoints = getCurrentPoints(currentTime)

  return {
    currentTime,
    streamList,
    currentPoints,
  }
}) satisfies PageServerLoad;

const actions = {
  async default({ request }) {
    const formData = await request.formData()

    const currentTimeRaw = formData.get('currentTime')
    if (typeof currentTimeRaw !== 'string') {
      throw new Error('Missing currentTime')
    }
    const currentTime = parseISO(currentTimeRaw)
    const currentPoints = getCurrentPoints(currentTime)

    for (const [key, valueRaw] of formData.entries()) {
      if (key.startsWith('stream-')) {
        if (typeof valueRaw !== 'string') {
          throw new Error('Invalid stream value')
        }
        const streamId = key.slice(7)
        const currentPoint = currentPoints.get(streamId)

        const value = valueRaw.replace(/\r/g, '')
        if (currentPoint?.value !== value) {
          if (currentPoint?.startedAt === currentTime.toISOString()) {
            currentPoint.value = value
          } else {
            pointList.push({
              id: randomUUID(),
              streamId,
              value,
              startedAt: currentTime.toISOString()
            })
          }
        }
      }
    }

  }
} satisfies Actions;

export { load, actions }
