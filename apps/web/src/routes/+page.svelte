<script lang="ts">
import type { LabelId, StreamId } from '#lib/ids.js'
import type { PageProps } from './$types'

import { query } from '#lib/utils/query.js'

const { data }: PageProps = $props()
const { store } = $derived(data)

import { genId } from '#lib/utils/gen-id.js'

const { userList, streamList, labelList, pointList } = $derived(
  query({
    userList: store.user.asList,
    streamList: store.stream.asList,
    labelList: store.label.asList,
    pointList: store.point.asList,
  }),
)

let newStreamName = $state<string>('')
let newLabelName = $state<string>('')
let newLabelIcon = $state<string>('')
let newLabelColor = $state<string>('')

let selectedStreamId = $state<StreamId>()
let selectedLabelIdList = $state<LabelId[]>([])
</script>

<main>
  <section>
    <h2>Users</h2>

    {#each userList as user (user.id)}
      <div>
        {user.id}
        <pre><code>{JSON.stringify(user, null, 2)}</code></pre>
      </div>
    {/each}
  </section>

  <section>
    <header>
      <h2>Streams</h2>

      <fieldset>
        <input type="text" bind:value={newStreamName} />
        <button
          onclick={() => {
            void store.mutate.stream_create({
              streamId: genId(),
              name: newStreamName,
            })
            newStreamName = ''
          }}>Create Stream</button>
      </fieldset>
    </header>

    <div class="List">
      {#each streamList as stream (stream.id)}
        <label class="Stream">
          <input type="radio" name="stream" bind:group={selectedStreamId} value={stream.id} />
          {stream.name}
          <pre><code>{JSON.stringify(stream, null, 2)}</code></pre>
        </label>
      {/each}
    </div>
  </section>

  <section>
    <header>
      <h2>Labels</h2>

      <fieldset>
        <label>
          Name
          <input type="text" bind:value={newLabelName} />
        </label>
        <label>
          Icon
          <input type="text" bind:value={newLabelIcon} />
        </label>
        <label>
          Color
          <input type="color" bind:value={newLabelColor} />
        </label>

        <button
          disabled={selectedStreamId === undefined}
          onclick={() => {
            if (!selectedStreamId) {
              return
            }

            void store.mutate.label_create({
              labelId: genId(),
              streamId: selectedStreamId,
              name: newLabelName,
              color: newLabelColor,
              icon: newLabelIcon,
            })
          }}>Create Label</button>
      </fieldset>
    </header>

    <div class="List">
      {#each labelList as label (label.id)}
        <label>
          <input type="checkbox" bind:group={selectedLabelIdList} value={label.id} />
          {label.icon}
          {label.name}
          ({label.color})
          <pre><code>{JSON.stringify(label, null, 2)}</code></pre>
        </label>
      {/each}
    </div>
  </section>

  <section>
    <header>
      <h2>Points</h2>
      <button
        disabled={selectedStreamId === undefined}
        onclick={() => {
          if (!selectedStreamId) {
            return
          }

          void store.mutate.point_create({
            pointId: genId(),
            streamId: selectedStreamId,
            labelIdList: selectedLabelIdList,
            description: 'test',
            startedAt: Date.now(),
          })
        }}>Create Point</button>
    </header>

    <div class="List">
      {#each pointList as point (point.id)}
        <div>ID: {point.id}</div>
        <pre><code>{JSON.stringify(point, null, 2)}</code></pre>
      {/each}
    </div>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }

  main {
    position: fixed;
    width: 100vw;
    top: 0;
    bottom: 0;

    background: #eee;

    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }

  section {
    background: #fff;
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  fieldset {
    display: flex;
    flex-direction: column;
  }

  .Stream {
    &:has(input:checked) {
      background: lightyellow;
    }
  }

  .List {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
</style>
