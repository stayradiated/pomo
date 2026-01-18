import type { RNG } from '#lib/utils/random.js'

import { memoize } from '#lib/utils/memoize.js'
import * as random from '#lib/utils/random.js'

class Faker {
  #initialSeed: number
  #rng: RNG

  constructor(seed: string) {
    // Simple string hash for seed
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0
    }
    this.#initialSeed = hash || 1
    this.#rng = random.createRNG(this.#initialSeed)
  }

  reset() {
    this.#rng = random.createRNG(this.#initialSeed)
  }

  random(): number {
    return this.#rng.next().value
  }

  timestamp(): number {
    const date = new Date('2025-01-01T00:00:00Z')
    const offset = this.number(0, 1000 * 60 * 60 * 24 * 365)
    return date.getTime() + offset
  }

  date(): Date {
    return new Date(this.timestamp())
  }

  // pick a random element from an array
  arrayElement<T>(arr: T[]): T {
    return random.arrayElement(this.#rng, arr)
  }

  // pick N unique elements from an array
  arrayElements<T>(arr: T[], count: number): T[] {
    return random.arrayElements(this.#rng, arr, count)
  }

  number(min: number, max: number): number {
    return random.integer(this.#rng, min, max)
  }

  #streamNames = [
    'Location',
    'Country',
    'City',
    'Neighborhood',
    'Home',
    'Address',
    'Family',
    'Friend',
    'Partner',
    'Colleague',
    'Community',
    'Job',
    'Career',
    'Workplace',
    'School',
    'Education',
    'Skill',
    'Hobby',
    'Interest',
    'Project',
    'Goal',
    'Task',
    'Routine',
    'Schedule',
    'Habit',
    'Health',
    'Fitness',
    'Finance',
    'Phone',
    'Vehicle',
  ]

  streamName(): string {
    return this.arrayElement(this.#streamNames)
  }
}

const getFaker = memoize(
  (seed = 'default') => {
    return new Faker(seed)
  },
  {
    cacheKey: ([seed]) => seed,
  },
)

export { Faker, getFaker }
