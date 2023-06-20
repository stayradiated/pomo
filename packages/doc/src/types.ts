import type Automerge from '@automerge/automerge'
import type { User, Point, Stream } from '@stayradiated/pomo-core'

export type Doc = {
  user: Record<string, User>
  point: Record<string, Point>
  stream: Record<string, Stream>
}

export type AutomergeDoc = Automerge.Doc<Doc>
