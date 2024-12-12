import { spawn } from 'node:child_process'
import http from 'node:http'
import { URL } from 'node:url'
import { z } from 'zod'
import type { Session } from './types.js'

const OAUTH_AUTHORIZE_URL = 'https://www.strava.com/oauth/authorize'
const OAUTH_TOKEN_URL = 'https://www.strava.com/api/v3/oauth/token'

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

type GetStravaAuthUrlOptions = {
  clientId: string
  serverPort: number
}

const getStravaAuthUrl = (options: GetStravaAuthUrlOptions) => {
  const { clientId, serverPort } = options
  const url = new URL(OAUTH_AUTHORIZE_URL)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', `http://localhost:${serverPort}`)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'read_all,activity:read_all')
  return url.toString()
}

const $OAuthTokenResponse = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number(),
})

type OpenAuthPageOptions = {
  clientId: string
  clientSecret: string
  serverPort: number
}

const openAuthPage = async (options: OpenAuthPageOptions) => {
  const { clientId, clientSecret, serverPort } = options

  const url = getStravaAuthUrl({ clientId, serverPort })
  console.log(`Open this page in your browser: ${url}`)
  open(url)

  const app = http.createServer()
  const server = app.listen(serverPort)
  console.log(`Listening on port ${serverPort}`)

  return new Promise<Session>((resolve) => {
    app.on('request', async (request, res) => {
      if (typeof request.url !== 'string') {
        return
      }

      const url = new URL(request.url, `http://localhost:${serverPort}`)
      if (url.pathname !== '/') {
        res.statusCode = 404
        res.end('Not found')
        return
      }

      const code = url.searchParams.get('code')
      console.log('Received authorization code :)')

      const response = await fetch(OAUTH_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
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

const $RefreshTokenResponse = z.union([
  z.object({
    message: z.string(),
    errors: z.array(
      z.object({
        resource: z.string(),
        field: z.string(),
        code: z.string(),
      }),
    ),
  }),
  z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_at: z.number(),
  }),
])

type RefreshSessionOptions = {
  clientId: string
  clientSecret: string
  session: Session
}

const refreshSession = async (
  options: RefreshSessionOptions,
): Promise<Session> => {
  const { clientId, clientSecret, session } = options

  console.log('Refreshing session…')

  const response = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: session.refreshToken,
    }),
  })

  const rawResponseBody = await response.json()
  const responseBody = $RefreshTokenResponse.parse(rawResponseBody)

  if ('errors' in responseBody) {
    throw new Error(JSON.stringify(responseBody.errors))
  }
  return {
    accessToken: responseBody.access_token,
    refreshToken: responseBody.refresh_token,
    expiresAt: responseBody.expires_at,
  }
}

type GetOrRefreshSessionOptions = {
  clientId: string
  clientSecret: string
  serverPort: number
  session?: Session
}

const getOrRefreshSession = async (
  options: GetOrRefreshSessionOptions,
): Promise<Session> => {
  const { session } = options

  if (session) {
    if (session.expiresAt > Math.ceil(Date.now() / 1000)) {
      console.log('Reusing existing session…')
      return session
    }

    return refreshSession({ ...options, session })
  }

  return openAuthPage(options)
}

export { openAuthPage, refreshSession, getOrRefreshSession }
