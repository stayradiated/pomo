const absoluteWsUrl = (windowLocation: Location, path: string): string => {
  const url = new URL(path, windowLocation.origin)
  url.protocol = windowLocation.protocol === 'https:' ? 'wss:' : 'ws:'
  return url.toString()
}

export { absoluteWsUrl }
