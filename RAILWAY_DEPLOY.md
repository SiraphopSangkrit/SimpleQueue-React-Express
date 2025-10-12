# Railway Deployment Guide

## Backend Deployment Steps

### 1. Prepare Your Railway Project

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Create a new project from your repository

### 2. Configure Backend Service

1. In Railway dashboard, select your project
2. Click "Add Service" → "GitHub Repo"
3. Select your repository
4. Set the **Root Directory** to `Server`

### 3. Set Environment Variables

In Railway dashboard, go to your service → Variables tab and set:

```
NODE_ENV=production
PORT=3000
```

### 4. Add MongoDB Database

1. In your Railway project, click "Add Service"
2. Select "Database" → "Add MongoDB"
3. Railway will automatically provide connection string
4. Copy the `MONGO_URL` from MongoDB service variables
5. Add it to your backend service as `MONGO_DB_URL`

### 5. Deploy

- Railway will automatically deploy when you push to your repository
- Check the deployment logs for any errors
- Your service will be available at the provided Railway URL

## Frontend Deployment (Optional - Separate Service)

If you want to deploy frontend separately:

1. Create another service with Root Directory set to `Frontend`
2. Set environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend-railway-url.railway.app
   ```

## Common Issues and Solutions

### 502 Bad Gateway
- Check if PORT environment variable is set
- Ensure your app listens on `0.0.0.0:$PORT`
- Check deployment logs for errors

### Database Connection Issues
- Verify MONGO_DB_URL is correctly set
- Check MongoDB service is running
- Ensure connection string includes authentication

### Build Failures
- Check package.json scripts
- Ensure all dependencies are listed
- Review build logs for specific errors

## Health Check

Your service should respond at: `https://your-app.railway.app/health`