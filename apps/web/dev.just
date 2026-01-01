# Start development server
default: start

# Start development server
start:
    ./scripts/vite/dev restart

# Check development server status
status:
    ./scripts/vite/dev status

# Tail development server logs
logs:
    ./scripts/vite/dev logs

# Stop development server
stop:
    ./scripts/vite/dev stop

