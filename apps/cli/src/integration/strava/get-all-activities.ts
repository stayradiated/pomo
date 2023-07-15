import { URL } from 'node:url'
import { fetch } from 'undici'
import { z } from 'zod'
import { paginateAll } from './paginate-all.js'

const ACTIVITIES_URL = 'https://www.strava.com/api/v3/athlete/activities'

const $Activity = z.object({
  start_date: z.string(),
  elapsed_time: z.number(),
  name: z.string(),
  type: z.string(),
  distance: z.number(),
})
type Activity = z.infer<typeof $Activity>

const $ActivityResponse = z.array($Activity)
type ActivityResponse = z.infer<typeof $ActivityResponse>

const getActivities = async (
  accessToken: string,
  page: number,
): Promise<ActivityResponse> => {
  const url = new URL(ACTIVITIES_URL)
  url.searchParams.set('access_token', accessToken)
  url.searchParams.set('per_page', '100')
  url.searchParams.set('page', page.toString())

  const response = await fetch(url)
  const responseBody = await response.json()

  const body = $ActivityResponse.parse(responseBody)
  return body
}

const getAllActivities = (
  accessToken: string,
): AsyncIterableIterator<Activity> => {
  return paginateAll<ActivityResponse, Activity>({
    hasNext(page) {
      return page.body.length === 100
    },
    async getPageBody(index) {
      return getActivities(accessToken, index)
    },
    async parse(page) {
      return page.body
    },
  })
}

export { getAllActivities }
