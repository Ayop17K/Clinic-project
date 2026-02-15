#!/bin/bash

# Quick Start Script for Clinic Desktop App (macOS/Linux)
# Run this script to set up and start the desktop app

echo ""
echo "===================================="
echo "Clinic Desktop App - Quick Start"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found"
node --version

echo ""
echo "Step 1: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "✗ Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"

echo ""
echo "Step 2: Starting development mode..."
echo ""
echo "This will:"
echo "- Start Angular dev server (http://localhost:4200)"
echo "- Launch Electron desktop app"
echo "- Support hot-reload on file changes"
echo ""

npm run electron-dev
