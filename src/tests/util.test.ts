import { describe, expect, test } from 'bun:test'
import { cleanPhoto } from '../scrapers/util'

describe('util', () => {
  describe('cleanPhoto', () => {
    test('should add https to the photo url', () => {
      const actual = cleanPhoto('//owcdn.net/img/633822848a741.png')
      const expeted = 'https://owcdn.net/img/633822848a741.png'

      expect(actual).toBe(expeted)
    })
    test('should return empty when undefined', () => {
      // @ts-ignore
      const actual = cleanPhoto(undefined)
      const expeted = ''

      expect(actual).toBe(expeted)
    })
    test('remove new lines and tabs from the photo url', () => {
      const actual = cleanPhoto('//owcdn.net/img/633822848a741.png\n\t')
      const expeted = 'https://owcdn.net/img/633822848a741.png'

      expect(actual).toBe(expeted)
    })
  })
})
