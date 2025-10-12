# Railway Deployment Guide

## Complete Deployment Steps

### 1. Prepare Your Railway Project

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Create a new project from your repository

### 2. Deploy Backend Service

#### Step 2.1: Configure Backend Service
1. In Railway dashboard, select your project
2. Click "Add Service" → "GitHub Repo"
3. Select your repository
4. Set the **Root Directory** to `Server`
5. Set **Dockerfile Path** to `Server/Dockerfile` (optional)

#### Step 2.2: Set Backend Environment Variables
In Railway dashboard, go to your backend service → Variables tab and set:

```
NODE_ENV=production
PORT=3000
```

#### Step 2.3: Add MongoDB Database
1. In your Railway project, click "Add Service"
2. Select "Database" → "Add MongoDB"
3. Railway will automatically provide connection string
4. Copy the `MONGO_URL` from MongoDB service variables
5. Add it to your backend service as `MONGO_DB_URL`

### 3. Deploy Frontend Service

#### Step 3.1: Configure Frontend Service
1. Click "Add Service" → "GitHub Repo"
2. Select the same repository
3. Set the **Root Directory** to `Frontend`
4. Set **Dockerfile Path** to `Frontend/Dockerfile.railway` (recommended)

#### Step 3.2: Set Frontend Environment Variables
```
NODE_ENV=production
VITE_API_BASE_URL=https://your-backend-service.railway.app
PORT=5173
```

**Important:** Replace `your-backend-service.railway.app` with your actual backend Railway URL

### 4. Frontend Deployment Options

#### Option A: Node.js + Vite Preview (Recommended for Railway)
- Uses `Dockerfile.railway`
- Serves built files with Vite preview server
- Automatically handles PORT environment variable

#### Option B: Static + Nginx
- Uses `Dockerfile.static`
- More efficient for pure static hosting
- Better for high-traffic applications

#### Option C: Railway Static Sites
- Set build command: `npm run build`
- Set output directory: `dist`
- No Dockerfile needed

### 5. Post-Deployment Configuration

#### 5.1: Get Service URLs
1. Copy your backend service URL from Railway dashboard
2. Update frontend's `VITE_API_BASE_URL` environment variable
3. Redeploy frontend service

#### 5.2: Configure Custom Domain (Optional)
1. In Railway dashboard, go to service → Settings
2. Add your custom domain
3. Update DNS records as instructed

### 6. Health Checks

- **Backend**: `https://your-backend.railway.app/health`
- **Frontend**: `https://your-frontend.railway.app`

## Common Issues and Solutions

### 502 Bad Gateway
- ✅ Check if PORT environment variable is set
- ✅ Ensure your app listens on `0.0.0.0:$PORT`
- ✅ Check deployment logs for errors
- ✅ Verify start script uses `node` not `nodemon`

### Database Connection Issues
- ✅ Verify MONGO_DB_URL is correctly set
- ✅ Check MongoDB service is running
- ✅ Ensure connection string includes authentication

### Build Failures
- ✅ Check package.json scripts
- ✅ Ensure all dependencies are listed
- ✅ Review build logs for specific errors
- ✅ Verify TypeScript compilation

### CORS Issues
- ✅ Update backend CORS settings for production
- ✅ Verify frontend API URL is correct
- ✅ Check environment variables

### Environment Variables Not Working
- ✅ Prefix frontend vars with `VITE_`
- ✅ Redeploy after changing variables
- ✅ Check variable names and values

## File Structure for Railway

```
your-repo/
├── Server/
│   ├── Dockerfile              # Production backend
│   ├── Dockerfile.railway      # Railway-optimized backend
│   ├── railway.json           # Railway config
│   ├── package.json           # Updated start script
│   └── ...
├── Frontend/
│   ├── Dockerfile              # Production frontend (nginx)
│   ├── Dockerfile.railway      # Railway-optimized frontend
│   ├── Dockerfile.static       # Static nginx deployment
│   ├── railway.json           # Railway config
│   ├── vite.config.ts         # Updated for Railway
│   └── ...
└── RAILWAY_DEPLOY.md          # This guide
```

## Quick Commands

```bash
# Test backend locally
cd Server && npm start

# Test frontend locally
cd Frontend && npm run build && npm run preview

# Build frontend for production
cd Frontend && npm run build
```