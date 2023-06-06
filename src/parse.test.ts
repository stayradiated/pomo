import { test, expect } from 'vitest'
import { parse } from './parse.js'

test('hello world', () => {

  const result = parse(`
# animals

- [x] anteater
- [ ] badger
`)

  expect(result).toStrictEqual({
    animals: `- [x] anteater
- [ ] badger`
  })

})
