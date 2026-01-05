import type { Websocket } from 'websocket-ts'
import {
  ArrayQueue,
  ExponentialBackoff,
  WebsocketBuilder,
  WebsocketEvent,
} from 'websocket-ts'

import { absoluteWsUrl } from '#lib/utils/absolute-ws-url.js'

type WebSocketPokeSubscription = {
  unsubscribe: () => void
  ws: Websocket
}

// Cache for WebSocket connections
const wsCache = new Map<string, Websocket>()

/**
 * Get or create a WebSocket client for a specific URL
 */
const getWebsocketClient = (url: string): Websocket | Error => {
  // Check cache
  let ws = wsCache.get(url)

  if (!ws) {
    try {
      // Create new WebSocket with auto-reconnect and buffering
      ws = new WebsocketBuilder(url)
        .withBackoff(new ExponentialBackoff(1000, 7)) // 1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s
        .withBuffer(new ArrayQueue()) // Buffer messages when disconnected
        .build()

      wsCache.set(url, ws)
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return new Error('Unknown error ocurred while creating WebSocket')
    }
  }

  return ws
}

/**
 * Subscribe to poke notifications via WebSocket
 * This is a replacement for the SSE-based poke subscription
 */

type WebSocketPokeOptions = {
  onPoke: () => void
}

const subscribeToWebSocketPokes = (
  options: WebSocketPokeOptions,
): WebSocketPokeSubscription | Error => {
  const { onPoke } = options

  // Get the realtime client
  const ws = getWebsocketClient(absoluteWsUrl(window.location, '/websocket'))
  if (ws instanceof Error) {
    return ws
  }

  // Subscribe to messages
  const messageHandler = (_: Websocket, ev: MessageEvent) => {
    try {
      const message =
        typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data

      if (message.type === 'poke') {
        console.info('[WebSocketPoke] Received poke')
        onPoke()
      }
    } catch (error) {
      console.error('[WebSocketPoke] Error parsing message:', error)
    }
  }

  // Add event listener
  ws.addEventListener(WebsocketEvent.message, messageHandler)

  // Optional: Log connection events
  const openHandler = () => console.info('[WebSocketPoke] Connected')
  const closeHandler = () => console.info('[WebSocketPoke] Disconnected')
  const reconnectHandler = () => console.info('[WebSocketPoke] Reconnected')

  ws.addEventListener(WebsocketEvent.open, openHandler)
  ws.addEventListener(WebsocketEvent.close, closeHandler)
  ws.addEventListener(WebsocketEvent.reconnect, reconnectHandler)

  // Return subscription with unsubscribe method
  return {
    unsubscribe: () => {
      ws.removeEventListener(WebsocketEvent.message, messageHandler)
      ws.removeEventListener(WebsocketEvent.open, openHandler)
      ws.removeEventListener(WebsocketEvent.close, closeHandler)
      ws.removeEventListener(WebsocketEvent.reconnect, reconnectHandler)

      // Note: We don't close the WebSocket here as it might be used by other subscriptions
      // If you want to close it when no longer needed, you'd need reference counting
    },
    ws, // Expose the WebSocket instance if you need direct access
  }
}

export { subscribeToWebSocketPokes }
