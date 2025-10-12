#!/bin/bash

# Railway Frontend Deployment Script

echo "🚀 Starting frontend deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful! Ready for deployment."
    echo "📁 Build output is in ./dist directory"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Frontend is ready for Railway deployment!"