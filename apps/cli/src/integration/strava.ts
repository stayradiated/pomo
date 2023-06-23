import { URL } from 'node:url'
import http from 'node:http'
import { spawn } from 'node:child_process'
import { fetch } from 'undici'
import { z } from 'zod'
import { proxy } from '#src/lib/proxy.js'

const CLIENT_ID = '41535'
const CLIENT_SECRET = '8037af8638f3f1d10e77d1fce824070cf64f2101'

const OAUTH_AUTHORIZE_URL = 'https://www.strava.com/oauth/authorize'
const OAUTH_TOKEN_URL = 'https://www.strava.com/oauth/token'
const ACTIVITIES_URL = 'https://www.strava.com/api/v3/athlete/activities'

const PORT = 8000

type Page<Body> = {
  index: number
  body: Body
}

type PaginateAllOptions<Body, Value> = {
  initialPageIndex?: number
  hasNext: (page: Page<Body>) => boolean
  getPageBody: (index: number) => Promise<Body>
  parse: (page: Page<Body>) => Promise<Value[]>
}

async function* paginateAll<Body, Value>(
  options: PaginateAllOptions<Body, Value>,
): AsyncIterableIterator<Value> {
  const { initialPageIndex = 1, hasNext, getPageBody, parse } = options

  let page: Page<Body> = {
    index: initialPageIndex,
    body: await getPageBody(initialPageIndex),
  }

  while (true) {
    const values = await parse(page)
    for (const value of values) {
      yield value
    }

    if (!hasNext(page)) {
      break
    }

    const nextIndex = page.index + 1
    page = {
      index: nextIndex,
      body: await getPageBody(nextIndex),
    }
  }
}

const open = (url: string) => {
  // Open a url and detach
  switch (process.platform) {
    case 'darwin': {
      return spawn('open', [url], { detached: true, stdio: 'ignore' })
    }

    case 'win32': {
      return spawn('start', [url], { detached: true, stdio: 'ignore' })
    }

    default: {
      return spawn('xdg-open', [url], { detached: true, stdio: 'ignore' })
    }
  }
}

const getStravaAuthUrl = () => {
  const url = new URL(OAUTH_AUTHORIZE_URL)
  url.searchParams.set('client_id', CLIENT_ID)
  url.searchParams.set('redirect_uri', `http://localhost:${PORT}`)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'read_all,activity:read_all')
  return url.toString()
}

const $OAuthTokenResponse = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number(),
})

type Session = {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

const openAuthPage = async () => {
  const url = getStravaAuthUrl()
  console.log(`Open this page in your browser: ${url}`)
  open(url)

  const app = http.createServer()
  const server = app.listen(PORT)
  console.log(`Listening on port ${PORT}`)

  return new Promise<Session>((resolve) => {
    app.on('request', async (request, res) => {
      if (typeof request.url !== 'string') {
        return
      }

      const url = new URL(request.url, `http://localhost:${PORT}`)
      if (url.pathname !== '/') {
        res.statusCode = 404
        res.end('Not found')
        return
      }

      const code = url.searchParams.get('code')
      console.log(`Received authorization code :)`)

      const response = await fetch(OAUTH_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
        }),
      })
      const rawResponseBody = await response.json()
      const responseBody = $OAuthTokenResponse.parse(rawResponseBody)

      const session = {
        accessToken: responseBody.access_token,
        refreshToken: responseBody.refresh_token,
        expiresAt: responseBody.expires_at,
      }

      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end('You have been logged in. Please close this window...')

      server.close()

      resolve(session)
    })
  })
}

const refreshSession = async (session?: Session): Promise<Session> => {
  if (session && session.refreshToken) {
    const response = await fetch(OAUTH_TOKEN_URL, {
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: session.refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    const rawResponseBody = await response.json()
    const responseBody = $OAuthTokenResponse.parse(rawResponseBody)

    return {
      accessToken: responseBody.access_token,
      refreshToken: responseBody.refresh_token,
      expiresAt: responseBody.expires_at,
    }
  }

  return openAuthPage()
}

const $Activity = z.object({
  resource_state: z.number(),
  athlete: z.object({ id: z.number(), resource_state: z.number() }),
  name: z.string(),
  distance: z.number(),
  moving_time: z.number(),
  elapsed_time: z.number(),
  total_elevation_gain: z.number(),
  type: z.string(),
  sport_type: z.string(),
  workout_type: z.number().nullable().optional(),
  id: z.number(),
  start_date: z.string(),
  start_date_local: z.string(),
  timezone: z.string(),
  utc_offset: z.number(),
  location_city: z.null(),
  location_state: z.null(),
  location_country: z.null(),
  achievement_count: z.number(),
  kudos_count: z.number(),
  comment_count: z.number(),
  athlete_count: z.number(),
  photo_count: z.number(),
  map: z.object({
    id: z.string(),
    summary_polyline: z.string(),
    resource_state: z.number(),
  }),
  trainer: z.boolean(),
  commute: z.boolean(),
  manual: z.boolean(),
  private: z.boolean(),
  visibility: z.string(),
  flagged: z.boolean(),
  gear_id: z.string().nullable(),
  start_latlng: z.array(z.number()),
  end_latlng: z.array(z.number()),
  average_speed: z.number(),
  max_speed: z.number(),
  has_heartrate: z.boolean(),
  heartrate_opt_out: z.boolean(),
  display_hide_heartrate_option: z.boolean(),
  elev_high: z.number().optional(),
  elev_low: z.number().optional(),
  upload_id: z.number().nullable().optional(),
  upload_id_str: z.string().optional(),
  external_id: z.string().nullable().optional(),
  from_accepted_tag: z.boolean(),
  pr_count: z.number(),
  total_photo_count: z.number(),
  has_kudoed: z.boolean(),
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

type Options = {
  initialSession?: Session
}

type Result = {
  session: Session
}

const pullStravaActivities = async (options: Options): Promise<Result> => {
  const { initialSession } = options
  const session = await refreshSession(initialSession)

  const streamId = await proxy.upsertStream({ name: 'Strava' })
  if (streamId instanceof Error) {
    throw new TypeError('Stream not found')
  }

  for await (const activity of getAllActivities(session.accessToken)) {
    const startDate = new Date(activity.start_date)
    const stopDate = new Date(
      startDate.getTime() + activity.elapsed_time * 1000,
    )
    const durationMin = activity.elapsed_time / 60

    console.log(activity.name, startDate, stopDate, durationMin)

    const upsertStartResult = await proxy.upsertPoint({
      streamId,
      value: activity.name,
      startedAt: startDate.getTime(),
    })
    if (upsertStartResult instanceof Error) {
      throw upsertStartResult
    }

    const upsertStopResult = await proxy.upsertPoint({
      streamId,
      value: '',
      startedAt: stopDate.getTime(),
    })
    if (upsertStopResult instanceof Error) {
      throw upsertStartResult
    }
  }

  return { session }
}

export { pullStravaActivities }
