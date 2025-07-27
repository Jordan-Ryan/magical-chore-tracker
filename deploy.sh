#!/bin/bash

# Magical Chore Tracker - Deployment Script
echo "🦉 Deploying Magical Chore Tracker to GitHub Pages..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://jordan-ryan.github.io/magical-chore-tracker"
echo "⏰ It may take a few minutes for changes to appear." 