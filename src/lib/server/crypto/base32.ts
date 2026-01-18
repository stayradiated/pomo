// https://www.crockford.com/base32.html
const CROCKFORD_BASE32_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

/*
 * TODO: Waiting for the `encodeBase32_internal` function to be exported from
 * `@oslojs/encoding`.
 * https://github.com/oslo-project/encoding/blob/main/src/base32.ts
 */
function encodeBase32(bytes: Uint8Array, alphabet: string): string {
  let result = ''
  for (let i = 0; i < bytes.byteLength; i += 5) {
    let buffer = 0n
    let bufferBitSize = 0
    for (let j = 0; j < 5 && i + j < bytes.byteLength; j++) {
      const byte = bytes[i + j]
      if (byte !== undefined) {
        buffer = (buffer << 8n) | BigInt(byte)
        bufferBitSize += 8
      }
    }
    if (bufferBitSize % 5 !== 0) {
      buffer = buffer << BigInt(5 - (bufferBitSize % 5))
      bufferBitSize += 5 - (bufferBitSize % 5)
    }
    for (let j = 0; j < 8; j++) {
      if (bufferBitSize >= 5) {
        result +=
          alphabet[Number((buffer >> BigInt(bufferBitSize - 5)) & 0x1fn)]
        bufferBitSize -= 5
      } else if (bufferBitSize > 0) {
        result +=
          alphabet[Number((buffer << BigInt(6 - bufferBitSize)) & 0x3fn)]
        bufferBitSize = 0
      }
    }
  }
  return result
}

type Codec = {
  encode: (input: Uint8Array) => string
}

const base32: Codec = {
  encode(input) {
    return encodeBase32(input, CROCKFORD_BASE32_ALPHABET)
  },
}

export { base32 }
