# pomo

> where does the time go?

### streams

many time tracking tools are based around work

pomo isn't just for work, you can track anything

## Usage

There is a web app.

## Installation

Not easy at the moment.

```bash
pnpm install

pnpm exec prisma db push

mkdir -p $HOME/.local/share/pomo
mv pomo.db $HOME/.local/share/pomo

pnpm run build
sudo ln -s $(pwd)/dist/index.js /usr/local/bin/pomo 

pomo
```

## TODO:

- Publish to NPM
- Make installation as easy as `npm install @stayradiated/pomo`
- Add `pomo init` to create a new pomo.db
- Add `pomo list` to list active streams
- Add `pomo edit` to edit history
- Create web based UI for viewing history
- Find a way to share a slice of history with another person

## Nested Streams

Thinking about how some stream values are nested under other streams

Project: Runn
    → Activity: Meeting
    → Activity: Mail
        → Task: Reading Slack
        → Task: Writing Handover
    → Activity: Planning
        → Task: Writing Linear Ticket
    → Activity: Programming
        → Task: Bug Fixing

How do we define and use this tree?

## Tags

StreamValue entries only have a `value` field right now.

Ideally we would add some kind of tagging system to categories these values.

This could tie into the Nested Streams idea above.

Perhaps I could start by using #hashtags in my notes


## Points / Lines / Slices

### point

```
[12:09] Something happened
```

- a moment in time in a single stream
- only `startedAt` field

### line

```
[12:09] Something happened
        |
        |
        |
[12:22] Something stopped happening
```

- a connection between two points in a single stream
- has `startedAt` and `stoppedAt` fields

### slice

```
| Time  | Location | Project | Task     |
|-------|----------|---------|----------|
| 12:09 | Outside  | Runn    | Planning |
```

- a group of points in multiple streams that occur at the same time


### block

- a contiguous list of slices
- has startAt/endAt fields

|-------|--------------|----------|---------|----------|
| time  | country      | location | project | task     |
|-------|--------------|----------|---------|----------|
| ...   | Bordeaux, FR |          |         |          |
| ...   |              | Home     |         |          |
| ...   |              |          | Life    | Rest     |
| 08:15 |              | City     |         | Walking  |
| 08:30 |              | Café     | Runn    | Planning |
| 08:55 |              |          |         | Meeting  |
| 09:20 |              | City     | Life    | Walking  |
|-------|--------------|----------|---------|----------|

## Time Zones

What a pain to deal with.

Store dates in the database as UTC.
(.getISOString())

Could we store these as numbers?
It would be easier to calculate the difference?

Never use `new Date()`

Whenever we convert the date from a string into a Date object we should convert
it to the user's timezone, using `date-fns-tz`.

Exceptions are if we just comparing two dates to get the duration.

## Hierachy

Streams can be related to each other, in this parent/child relationship

- Country → City → Location
- Project → Task
- Feeling

Concept of "root" streams

{
  "stream": {
    "stream-1": {
      "name": "Country",
      "parentId": null
    },
    "stream-2": {
      "name": "City",
      "parentId": "stream-1"
    },
    "stream-3": {
      "name": "Location",
      "parentId": "stream-2"
    },
    "stream-4": {
      "name": "Project",
      "parentId": null
    },
    "stream-5": {
      "name": "Task",
      "parentId": "stream-4"
    },
    "stream-6": {
      "name": "Feeling",
      "parentId": null,
    }
  }
}

But this relationship only impacts the Labels that are part of the stream.

{
  "label": {
    "label-1": {
      "name": "France",
      "streamId": "stream-1",
      "parentId": null
    },
    "label-2": {
      "name": "Germany",
      "streamId": "stream-1",
      "parentId": null
    },
    "label-3": {
      "name": "Bordeaux",
      "streamId": "stream-2",
      "parentId": "label-1"
    },
    "label-4": {
      "name": "Paris",
      "streamId": "stream-2",
      "parentId": "label-1"
    },
    "label-5": {
      "name": "Berlin",
      "streamId": "stream-2",
      "parentId": "label-2"
    },
    "label-6": {
      "name": "Café 4e Vague",
      "streamId": "stream-3",
      "parentId": "label-3"
    },
    "label-7": {
      "name": "Charles de Gaulle Airport",
      "streamId": "stream-3",
      "parentId": "label-4"
    },
    "label-8": {
      "name": "Tempelhoferfeld",
      "streamId": "stream-3",
      "parentId": "label-5"
    }
  }
}

You can't move a label to a different stream - but you could copy it.

Possibly reorganise labels to group labels by streamId -- faster lookups and
guarantee that a label never has the wrong streamId. But does mean that labels
have a composite primary key and that could be harder to reference.

Can I use a regular array with YJS? Or must I always use a Y.Array?
If so, perhaps we could reference "parentId" as ['stream-3', 'label-7']
