# 🚀 Render Deployment Guide for Backend

This guide will help you deploy the Dream Uni Finder backend to Render.

## Prerequisites

1. A [Render](https://render.com) account (free tier available)
2. A MongoDB Atlas account (free tier available) or MongoDB database
3. Your API keys (Gemini API key, etc.)

## Step 1: Prepare Your MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free cluster
2. Create a database user and get your connection string
3. Whitelist Render's IP addresses (or use `0.0.0.0/0` for all IPs in development)

Your MongoDB URI should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/edupath_ai?retryWrites=true&w=majority
```

## Step 2: Deploy to Render

### Option A: Using Render Blueprint (Recommended)

1. **Push your code to GitHub**
   - Make sure your `backend` folder is in the repository
   - The `render.yaml` file should be in the `backend` directory

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables**
   - Render will prompt you to set environment variables
   - Add the following required variables:

### Option B: Manual Deployment

1. **Create a New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure the Service**
   - **Name**: `dream-uni-finder-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users (e.g., `Oregon`)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (or upgrade for better performance)

3. **Set Environment Variables**
   Click on "Environment" tab and add:

## Required Environment Variables

Add these in Render's Environment Variables section:

```bash
# Server Configuration
NODE_ENV=production
PORT=10000
API_VERSION=v1

# Database Configuration (MongoDB)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edupath_ai?retryWrites=true&w=majority

# JWT Configuration (Generate secure secrets)
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_secure_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=30d

# AI Service (Google Gemini)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# CORS Configuration
# Add your frontend URL(s) separated by commas
CORS_ORIGIN=https://your-frontend-domain.com,https://your-frontend-domain.onrender.com

# Security
SESSION_SECRET=your_secure_session_secret_here
```

### Optional Environment Variables

```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=UniSphere <noreply@unisphere.ai>

# OpenAI (Alternative AI service - Optional)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
```

## Step 3: Generate Secure Secrets

Generate secure secrets for JWT and session:

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Session Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use them as your `JWT_SECRET` and `SESSION_SECRET` values.

## Step 4: Deploy

1. Click "Create Web Service" (or "Apply" if using Blueprint)
2. Render will automatically:
   - Install dependencies (`npm install`)
   - Start your server (`npm start`)
   - Monitor the health check endpoint (`/health`)

## Step 5: Verify Deployment

1. **Check Health Endpoint**
   ```
   https://your-service-name.onrender.com/health
   ```
   Should return:
   ```json
   {
     "status": "OK",
     "timestamp": "...",
     "uptime": ...,
     "environment": "production"
   }
   ```

2. **Test API Endpoint**
   ```
   https://your-service-name.onrender.com/test
   ```

3. **Check Logs**
   - Go to your service dashboard
   - Click on "Logs" tab
   - Verify there are no errors
   - Look for: `✅ MongoDB Connected successfully`

## Step 6: Update Frontend Configuration

Update your frontend to use the Render backend URL:

```typescript
// In your frontend API configuration
const API_BASE_URL = 'https://your-service-name.onrender.com/api/v1';
```

## Important Notes

### Free Tier Limitations

- **Spinning Down**: Free tier services spin down after 15 minutes of inactivity
- **Cold Starts**: First request after spin-down may take 30-60 seconds
- **Build Time**: Free tier has limited build time (45 minutes)
- **Bandwidth**: 100GB/month included

### Production Recommendations

For production, consider upgrading to:
- **Starter Plan** ($7/month): No spin-down, better performance
- **Standard Plan** ($25/month): Even better performance and reliability

### CORS Configuration

Make sure to add your frontend URL(s) to `CORS_ORIGIN`:
- If frontend is also on Render: `https://your-frontend.onrender.com`
- If frontend is on Vercel: `https://your-frontend.vercel.app`
- Multiple origins: `https://domain1.com,https://domain2.com`

### Database Connection

- Ensure MongoDB Atlas allows connections from Render's IPs
- Use connection pooling settings in your MongoDB URI
- Monitor connection limits on free tier

### Environment Variables

- Never commit `.env` files to Git
- Use Render's Environment Variables UI for sensitive data
- Render automatically provides `RENDER_EXTERNAL_URL` (your service URL)
- Render automatically provides `PORT` (usually 10000)

## Troubleshooting

### Service Won't Start

1. Check logs in Render dashboard
2. Verify all required environment variables are set
3. Ensure `PORT` is set (Render provides this automatically)
4. Check MongoDB connection string is correct

### Database Connection Issues

1. Verify MongoDB Atlas IP whitelist includes Render IPs
2. Check MongoDB connection string format
3. Ensure database user has correct permissions
4. Check MongoDB Atlas cluster is running

### CORS Errors

1. Add frontend URL to `CORS_ORIGIN` environment variable
2. Check that `RENDER_EXTERNAL_URL` is being used correctly
3. Verify CORS middleware is configured properly

### Health Check Failing

1. Ensure `/health` endpoint is accessible
2. Check that server is listening on the correct port
3. Verify no errors in startup logs

## Monitoring

- **Logs**: Available in Render dashboard under "Logs" tab
- **Metrics**: View CPU, Memory, and Network usage
- **Events**: See deployment history and events

## Updating Your Deployment

1. Push changes to your GitHub repository
2. Render will automatically detect changes
3. A new deployment will start automatically
4. Old deployment remains active until new one is healthy

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- Check your service logs for specific errors

---

**🎉 Your backend is now deployed on Render!**

