import { getRandomValues } from 'node:crypto'
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding'

const genSecureToken = <T extends string>(entropy: number): T => {
  const bytes = getRandomValues(new Uint8Array(entropy))
  return encodeBase32LowerCaseNoPadding(bytes) as T
}

export { genSecureToken }
