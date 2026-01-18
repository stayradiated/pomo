import type {
  LabelId,
  PointId,
  ReplicacheClientId,
  StreamId,
  UserId,
} from '#lib/ids.js'

type VersionRecord<Key extends string> = Record<Key, number>
type CVR = {
  point: VersionRecord<PointId>
  stream: VersionRecord<StreamId>
  label: VersionRecord<LabelId>
  user: VersionRecord<UserId>
  replicacheClient: VersionRecord<ReplicacheClientId>
}

const EMPTY_CVR: CVR = {
  point: {},
  stream: {},
  label: {},
  user: {},
  replicacheClient: {},
}
const CVR_KEY_LIST = Object.keys(EMPTY_CVR) as (keyof CVR)[]

type CVREntryDiff<Key extends string> = {
  puts: Key[]
  dels: Key[]
}

type CVRDiff = {
  [K in keyof CVR]: CVR[K] extends VersionRecord<infer Key>
    ? CVREntryDiff<Key>
    : never
}

type UntypedCVRDiff = {
  [index: string]: CVREntryDiff<string>
}

type Row<Key> = {
  id: Key
  version: number
}

const buildVersionRecord = <Key extends string>(
  rowList: Row<Key>[],
): VersionRecord<Key> => {
  const versionRecord = {} as VersionRecord<Key>
  for (const { id, version } of rowList) {
    versionRecord[id] = version
  }
  return versionRecord
}

const diffCVR = (prev: CVR, next: CVR): CVRDiff => {
  const diff: UntypedCVRDiff = {}
  for (const key of CVR_KEY_LIST) {
    const prevEntries: VersionRecord<string> = prev[key] ?? {}
    const nextEntries: VersionRecord<string> = next[key] ?? {}

    diff[key] = {
      puts: [],
      dels: [],
    }

    for (const id in nextEntries) {
      if (
        prevEntries[id] === undefined ||
        prevEntries[id] < (nextEntries[id] ?? 0)
      ) {
        diff[key].puts.push(id)
      }
    }
    for (const id in prevEntries) {
      if (nextEntries[id] === undefined) {
        diff[key].dels.push(id)
      }
    }
  }
  return diff as CVRDiff
}

const isCVRDiffEmpty = (diff: CVRDiff) => {
  return Object.values(diff).every(
    (e) => e.puts.length === 0 && e.dels.length === 0,
  )
}

export { EMPTY_CVR, buildVersionRecord, diffCVR, isCVRDiffEmpty }
export type { CVR, VersionRecord, CVRDiff, CVREntryDiff }
