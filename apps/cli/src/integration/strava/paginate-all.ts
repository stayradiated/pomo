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

export { paginateAll }
