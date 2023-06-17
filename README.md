# pomo

> where does the time go?

### streams

many time tracking tools are based around work

pomo isn't just for work, you can track anything

## Usage

```bash
pomo
```

Opens up your editor with a markdown file.

Heading names (lines starting with `#`) represent a stream.

Content under the heading is the current state.

You can track multiple streams concurrently.

For example:

- country
- location
- activity
- project
- task

## Installation

Not easy at the moment.

```bash
pnpm install

export POMO_DATABASE_URL=file:./pomo.db
pnpm exec prisma db push

mkdir -p $HOME/.local/share/pomo
mv pomo.db $HOME/.local/share/pomo
export POMO_DATABASE_URL=$HOME/.local/share/pomo/pomo.db

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

