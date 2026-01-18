import type { Store } from '#lib/core/replicache/store.js'
import type { Faker } from './faker.js'

import { genId } from '#lib/utils/gen-id.js'

type GenerateBasicScenarioOptions = {
  store: Store
  faker: Faker
}

const generateBasicScenario = async (options: GenerateBasicScenarioOptions) => {
  const { store, faker } = options

  faker.reset()

  const streamCount = 5
  for (let i = 0; i < streamCount; i++) {
    await store.mutate.stream_create({
      streamId: genId(),
      name: faker.streamName(),
    })
  }
}

export { generateBasicScenario }
