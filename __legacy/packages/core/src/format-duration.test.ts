import { describe, expect, test } from 'vitest'
import { formatDurationRough } from './format-duration.js'

describe('formatDurationRough', () => {
  test('formats 0ms', () => {
    expect(formatDurationRough(0)).toBe('<1m')
  })
  test('formats 1ms', () => {
    expect(formatDurationRough(1)).toBe('<1m')
  })
  test('formats 1s', () => {
    expect(formatDurationRough(1000)).toBe('<1m')
  })
  test('formats 59s', () => {
    expect(formatDurationRough(1000 * 59)).toBe('<1m')
  })
  test('formats 1m', () => {
    expect(formatDurationRough(1000 * 60)).toBe('1m')
  })
  test('formats 1m 1s', () => {
    expect(formatDurationRough(1000 * 61)).toBe('1m')
  })
  test('formats 2m', () => {
    expect(formatDurationRough(1000 * 60 * 2)).toBe('2m')
  })
  test('formats 59m', () => {
    expect(formatDurationRough(1000 * 60 * 59)).toBe('59m')
  })
  test('formats 1h', () => {
    expect(formatDurationRough(1000 * 60 * 60)).toBe('1h')
  })
  test('formats 1h 1m', () => {
    expect(formatDurationRough(1000 * 60 * 60 + 1000 * 60)).toBe('1h 1m')
  })
  test('formats 23h', () => {
    expect(formatDurationRough(1000 * 60 * 60 * 23)).toBe('23h')
  })
  test('formats 1d', () => {
    expect(formatDurationRough(1000 * 60 * 60 * 24)).toBe('24h')
  })
  test('formats 2d', () => {
    expect(formatDurationRough(1000 * 60 * 60 * 24 * 2)).toBe('48h')
  })
  test('formats 2d 1h', () => {
    expect(formatDurationRough(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60)).toBe(
      '2d',
    )
  })
  test('formats 2d 1h 1m', () => {
    expect(
      formatDurationRough(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 + 1000 * 60),
    ).toBe('2d')
  })
  test('formats 2d 12h', () => {
    expect(
      formatDurationRough(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 12),
    ).toBe('2.5d')
  })
  test('formats 2d 22h', () => {
    expect(
      formatDurationRough(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 22),
    ).toBe('2.9d')
  })
})
