import { z } from 'zod'

import { $Label, $PointWithLabelList, $Stream, $User } from '#lib/schema.js'

const $Snapshot = z.object({
  user: z.array($User),
  stream: z.array($Stream),
  label: z.array($Label),
  point: z.array($PointWithLabelList),
})

type Snapshot = z.infer<typeof $Snapshot>

export { $Snapshot }
export type { Snapshot }
