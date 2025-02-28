# Pomo

> Track your time, your way.

Pomo is a time tracking tool designed to be flexible and work with your workflow, rather than force you into a specific way of working. It supports tracking anything from work tasks to personal activities, with powerful labeling and organization features.

## Features

- **Streams**: Create multiple streams to track different types of activities (work, personal, location, etc.)
- **Labels**: Organize activities with customizable labels, colors and icons
- **CLI Interface**: Powerful command-line interface for quick data entry and querying
- **Web Interface**: Mobile-friendly web interface for viewing and managing your time data
- **Offline Support**: Works offline with local storage and syncs when online
- **Export Options**: Export data to CSV, Google Calendar, or Toggl formats
- **Open Source**: Fully open source and self-hostable

## Getting Started

### Installation

```bash
# Install from npm
npm install -g @stayradiated/pomo

# Initialize the database
pomo init

# Set your timezone
pomo user set timezone "Pacific/Auckland"
```

### Quick Start

```bash
# Start tracking a task
pomo add "Working on project"

# Add labels to tasks
pomo add "Meeting with client" --label "Client,Meeting"

# View today's log
pomo log

# View summary for the week
pomo summary --span 7
```

## Architecture

Pomo is built with:

- **CLI**: Node.js command line interface
- **Web UI**: SvelteKit progressive web app
- **Storage**: YJS for local-first data sync
- **Data Format**: Custom document format for time tracking data

### Components

- `apps/cli`: Command line interface
- `apps/mobile`: Web/mobile interface
- `packages/core`: Shared business logic
- `packages/doc`: Document storage and sync

## Data Model

### Streams

Streams are top-level categories for tracking different types of data:

- Location (where you are)
- Project (what you're working on)
- Task (specific activities)
- Status (how you're feeling)

### Points

Points record moments in time when something changed:

```
[12:09] Started working
[12:22] Finished working
```

### Labels

Labels help categorize and group related activities:

- Project labels: "Client A", "Internal"
- Activity labels: "Meeting", "Development"
- Location labels: "Office", "Home"

Labels can have:
- Colors
- Icons
- Parent/child relationships

## Configuration

Configuration is stored in the user's home directory:

```
$HOME/.local/share/pomo/state
```

## Advanced Usage

### Export Data

```bash
# Export to CSV
pomo csv export

# Export to Google Calendar
pomo gcal export

# Export to Toggl
pomo toggl export
```

### Sync

Pomo supports syncing data between devices:

```bash
# Sync with remote server
pomo sync https://your-server.com/sync
```

## Contributing

Contributions are welcome! Please check out our [contributing guidelines](CONTRIBUTING.md).

## License

ISC License

## Support

- GitHub Issues: [stayradiated/pomo/issues](https://github.com/stayradiated/pomo/issues)
