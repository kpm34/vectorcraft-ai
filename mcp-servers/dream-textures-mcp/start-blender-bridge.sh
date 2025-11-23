#!/bin/bash

# Start Blender Bridge for Dream Textures MCP
# This script starts Blender in headless mode with the Flask bridge

BLENDER_PATH="/Users/postgres/Blender.app/Contents/MacOS/Blender"
BRIDGE_SCRIPT="$(dirname "$0")/blender_bridge.py"

echo "=================================="
echo "Starting Blender Bridge"
echo "=================================="
echo "Blender: $BLENDER_PATH"
echo "Bridge Script: $BRIDGE_SCRIPT"
echo ""
echo "Starting Blender headless..."
echo "API will be available at: http://127.0.0.1:5555"
echo ""
echo "Press Ctrl+C to stop"
echo "=================================="
echo ""

# Start Blender in background mode
"$BLENDER_PATH" --background --python "$BRIDGE_SCRIPT"
