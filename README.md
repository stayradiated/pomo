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
