import type { LocalMutator } from './types.ts'

const dangerDeleteAllData: LocalMutator<'danger_deleteAllData'> = async (
  context,
  options,
) => {
  const { tx } = context
  const { userHasConfirmed } = options

  if (!userHasConfirmed) {
    throw new Error('User has not confirmed deletion')
  }

  for await (const key of tx.scan().keys()) {
    tx.del(key)
  }
}

export default dangerDeleteAllData
