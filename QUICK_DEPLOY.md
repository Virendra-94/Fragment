# Complete CodeShare Deployment Guide

## 🚀 Option 1: Single Service Deployment (Render.com) - RECOMMENDED

This deploys both frontend and backend as a single service. The server serves the React build files.

### Step 1: Prepare for Deployment
```bash
# Make sure you're in the project root
cd codeshare

# Test the build locally first
npm run build

# Commit your changes
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Use these **EXACT** settings:
   - **Name**: `codeshare-app`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
   - **Auto-Deploy**: Yes

### Step 3: Set Environment Variables
In Render dashboard, go to Environment and add:
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render's default)

### Step 4: Access Your App
Your app will be available at: `https://codeshare-app-[random].onrender.com`

**✅ This method ensures both client and server work seamlessly together!**

---

## 🔄 Option 2: Separate Frontend/Backend Deployment

Deploy frontend and backend separately for better scalability.

### Frontend (Netlify)
1. Build the React app:
   ```bash
   cd client
   npm run build
   ```
2. Go to https://netlify.com
3. Drag and drop the `client/build` folder
4. Note your Netlify URL (e.g., `https://amazing-site-123.netlify.app`)

### Backend (Railway)
1. Go to https://railway.app
2. Create new project from GitHub
3. Set these environment variables:
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-netlify-url.netlify.app`
4. Set start command: `node server/index.js`

### Update Frontend API URL
In `client/src`, update API calls to point to your Railway backend URL.

---

## 🛠️ Troubleshooting

### If deployment fails:
1. Check build logs in Render dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility

### If app loads but API doesn't work:
1. Check environment variables are set correctly
2. Verify CORS settings in server code
3. Check network tab in browser dev tools

### Common Issues:
- **Build fails**: Usually missing dependencies or Node version mismatch
- **App loads but blank**: Check console for JavaScript errors
- **API 404 errors**: Backend not properly serving frontend routes

## 🎉 Success!
Your CodeShare app should now be fully functional with:
- ✅ Code snippet sharing
- ✅ Image uploads
- ✅ Session-based sharing
- ✅ Mobile responsive design
- ✅ Short URL generation
