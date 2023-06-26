import { test, expect } from 'vitest'
import { parse } from './parse.js'

test('should handle empty item', () => {
  const result = parse(`
# empty





`)

  expect(result).toStrictEqual([{
    heading: 'empty',
    labels: [],
    text: ''
  }])
})

test('should preserve markdown formatted text', () => {
  const result = parse(`
# animals

- [x] anteater
- [ ] badger
`)

  expect(result).toStrictEqual([{
    heading: 'animals',
    labels: [],
    text: `- [x] anteater
- [ ] badger`,
  }])
})

test('should extract labels', () => {
  const result = parse(`
# animals

> anteater, badger

must feed the animals
`)

  expect(result).toStrictEqual([{
    heading: 'animals',
    labels: ['anteater', 'badger'],
    text: 'must feed the animals',
  }])
})

test('should extract labels (multiline)', () => {
  const result = parse(`
# animals

> anteater, jaguar
> badger, lion

must feed the animals
`)

  expect(result).toStrictEqual([{
    heading: 'animals',
    labels: ['anteater', 'jaguar', 'badger', 'lion'],
    text: 'must feed the animals',
  }])
})
