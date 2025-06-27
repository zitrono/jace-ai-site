#!/bin/bash

# Dev server manager script - prevents zombie processes and handles server lifecycle properly

PORT=4321
DEV_PID_FILE=".dev-server.pid"

# Check if port is in use (cross-platform approach)
check_port() {
    if command -v nc >/dev/null 2>&1; then
        # Use netcat if available (most portable)
        if nc -z localhost $PORT 2>/dev/null; then
            return 0  # Port in use
        else
            return 1  # Port available
        fi
    elif command -v lsof >/dev/null 2>&1; then
        # Fall back to lsof on Unix-like systems
        lsof -i:$PORT >/dev/null 2>&1
        return $?
    else
        # Last resort: try to connect with curl
        curl -s http://localhost:$PORT/ >/dev/null 2>&1
        return $?
    fi
}

# Stop existing server gracefully
stop_server() {
    if [ -f "$DEV_PID_FILE" ]; then
        PID=$(cat "$DEV_PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            echo "Stopping existing dev server (PID: $PID)..."
            # Try graceful shutdown first (SIGTERM)
            kill -15 "$PID" 2>/dev/null
            sleep 2
            # Force kill if still running
            if kill -0 "$PID" 2>/dev/null; then
                kill -9 "$PID" 2>/dev/null
            fi
        fi
        rm -f "$DEV_PID_FILE"
    fi
    
    # Also check for any orphaned processes on the port
    if check_port; then
        echo "Port $PORT still in use, cleaning up..."
        if command -v lsof >/dev/null 2>&1; then
            lsof -ti:$PORT | xargs kill -9 2>/dev/null
        fi
    fi
}

# Start dev server with proper process management
start_server() {
    if check_port; then
        echo "Dev server already running on port $PORT"
        return 0
    fi
    
    echo "Starting dev server on port $PORT..."
    # Start in background and capture PID
    npm run dev > /dev/null 2>&1 &
    PID=$!
    echo $PID > "$DEV_PID_FILE"
    
    # Wait a moment for server to start
    sleep 3
    
    if check_port; then
        echo "Dev server started successfully (PID: $PID)"
        echo "Access at: http://localhost:$PORT/ralph-web/"
    else
        echo "Failed to start dev server"
        rm -f "$DEV_PID_FILE"
        return 1
    fi
}

# Clean up on script exit
cleanup() {
    stop_server
}

# Set up signal handlers for cleanup
trap cleanup EXIT INT TERM

# Main logic
case "${1:-start}" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        stop_server
        start_server
        ;;
    status)
        if check_port; then
            echo "Dev server is running on port $PORT"
            if [ -f "$DEV_PID_FILE" ]; then
                echo "PID: $(cat $DEV_PID_FILE)"
            fi
        else
            echo "Dev server is not running"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac