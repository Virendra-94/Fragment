# Deployment Guide for Render.com

## Prerequisites
- GitHub account
- Render.com account (free tier available)

## Step-by-Step Deployment Instructions

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Deploy Backend on Render

1. Go to [Render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `codeshare-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
   - **Advanced Settings**:
     - Add Environment Variable: `NODE_ENV` = `production`

### 3. Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Configure the static site:
   - **Name**: `codeshare-frontend`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`
   - **Plan**: Free

### 4. Configure Environment Variables

In your backend service on Render, add these environment variables:
- `NODE_ENV`: `production`
- `FRONTEND_URL`: `https://your-frontend-url.onrender.com`
- `BACKEND_URL`: `https://your-backend-url.onrender.com`

### 5. Update Frontend API Calls

The frontend needs to point to your backend URL instead of localhost.

## Alternative: Single Service Deployment

You can also deploy as a single service that serves both frontend and backend:

1. Use the `render.yaml` file in the root directory
2. Deploy as a "Blueprint" on Render
3. This will automatically create both services

## Troubleshooting

- If build fails, check the build logs in Render dashboard
- Ensure all dependencies are listed in package.json
- Check that Node.js version is compatible (18.x specified in engines)

## Expected URLs
- Backend: `https://codeshare-backend-[random].onrender.com`
- Frontend: `https://codeshare-frontend-[random].onrender.com`

The frontend will be your main application URL that users should visit.
