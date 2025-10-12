# Railway Deployment Checklist

## Pre-Deployment Checklist

### Backend ✅
- [x] Updated package.json start script to use `node` instead of `nodemon`
- [x] Moved `nodemon` to devDependencies
- [x] Created Railway-optimized Dockerfile
- [x] Added railway.json configuration
- [x] Environment variables template created

### Frontend ✅
- [x] Updated vite.config.ts for Railway compatibility
- [x] Added serve dependency for production
- [x] Created multiple Dockerfile options
- [x] Updated package.json scripts
- [x] Added Railway configuration

## Railway Deployment Steps

### 1. Backend Deployment
1. Create new Railway project
2. Add service from GitHub repo
3. Set root directory: `Server`
4. Set environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   ```
5. Add MongoDB database service
6. Copy MongoDB URL to `MONGO_DB_URL` variable

### 2. Frontend Deployment
1. Add second service to same project
2. Set root directory: `Frontend`
3. Set environment variables:
   ```
   NODE_ENV=production
   VITE_API_BASE_URL=https://your-backend.railway.app
   PORT=5173
   ```

### 3. Post-Deployment
1. Get backend URL from Railway
2. Update frontend `VITE_API_BASE_URL`
3. Redeploy frontend
4. Test both services

## Environment Variables Summary

### Backend Service
```
NODE_ENV=production
PORT=3000
MONGO_DB_URL=mongodb://[railway-provided-url]
```

### Frontend Service
```
NODE_ENV=production
PORT=5173
VITE_API_BASE_URL=https://your-backend.railway.app
```

## Troubleshooting

### Common Issues
- ❌ 502 Bad Gateway → Check PORT variable and start script
- ❌ Build failures → Check dependencies and build script
- ❌ CORS errors → Verify API URL and backend CORS config
- ❌ Environment variables → Ensure correct naming (VITE_ prefix for frontend)

### Useful Commands
```bash
# Test locally
npm run build
npm run preview

# Check build output
ls -la dist/

# Test API connection
curl https://your-backend.railway.app/health
```

## Success Indicators
✅ Backend health check responds: `/health`
✅ Frontend loads without errors
✅ API calls work from frontend to backend
✅ No CORS errors in browser console