import type { Replicache as GenericReplicache } from 'replicache'
import type { Except } from 'type-fest'

import type { ReplicacheMutatorDefs } from '#lib/mutator/types.js'
import type { Label, Point, Stream, User } from '#lib/types.local.js'
export type Replicache = GenericReplicache<ReplicacheMutatorDefs>
type ExceptId<T extends { id: string }> = Except<T, 'id'>

export type AnonUser = ExceptId<User>
export type AnonLabel = ExceptId<Label>
export type AnonPoint = ExceptId<Point>
export type AnonStream = ExceptId<Stream>
