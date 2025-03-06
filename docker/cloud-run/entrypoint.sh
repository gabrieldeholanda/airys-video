#!/bin/bash
set -e

# Function to log messages with timestamps
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Initialize environment
log "Initializing environment..."

# Verify Python installation
log "Python version: $(python3 --version)"
log "Pip version: $(pip3 --version)"

# Check if NVIDIA_VISIBLE_DEVICES is set and not empty
if [ -n "${NVIDIA_VISIBLE_DEVICES:-}" ] && [ "${NVIDIA_VISIBLE_DEVICES}" != "none" ]; then
    log "GPU environment detected, checking NVIDIA runtime..."
    if command -v nvidia-smi &> /dev/null; then
        nvidia-smi
    else
        log "Warning: NVIDIA runtime not found, continuing without GPU support"
    fi
else
    log "Running in CPU-only mode"
fi

# Ensure the application directory exists and we're in it
cd /opt/frigate
log "Working directory: $(pwd)"

# Verify directories exist
for dir in "/tmp/cache" "/config" "/media/frigate" "/videos"; do
    if [ -d "$dir" ]; then
        log "Directory $dir exists and is accessible"
    else
        log "Error: Directory $dir is missing or inaccessible"
        exit 1
    fi
done

# Start the application with proper logging
log "Starting application on port ${PORT:-8080}..."
log "Using $(nproc) CPU cores"
log "Available memory: $(free -h)"

# Use exec to replace shell with application (proper signal handling)
exec python3 -m uvicorn main:app \
    --host 0.0.0.0 \
    --port "${PORT:-8080}" \
    --workers 1 \
    --log-level info \
    --timeout-keep-alive 75 \
    --reload-dir /opt/frigate \
    --no-access-log 