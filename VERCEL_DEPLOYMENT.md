# Vercel Deployment Guide

This project is now configured to deploy on Vercel! 🚀

## Project Structure

- **Frontend**: Vite + React + TypeScript (auto-detected by Vercel)
- **Backend**: Express.js API (converted to serverless functions)

## Quick Deploy

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

   Or connect your GitHub repository directly in the Vercel dashboard.

## Environment Variables

Make sure to set these environment variables in your Vercel project settings:

### Required Variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens
- `GEMINI_API_KEY` - Google Gemini API key (for AI features)

### Optional Variables:
- `CORS_ORIGIN` - Comma-separated list of allowed origins (defaults to Vercel URL)
- `API_VERSION` - API version (defaults to `v1`)
- `NODE_ENV` - Set to `production` (automatically set by Vercel)

## How It Works

1. **Frontend**: Vercel automatically detects the Vite project and builds it, serving the static files from the `dist` directory.

2. **Backend**: The Express app in `backend/src/index.js` is exported as a serverless function. Vercel automatically detects the `/api` folder and creates serverless functions.

3. **Routing**: 
   - All `/api/*` routes are handled by the serverless function
   - All other routes serve the React app (SPA routing)

## API Endpoints

Once deployed, your API will be available at:
- `https://your-project.vercel.app/api/v1/*`
- `https://your-project.vercel.app/health`

## Important Notes

1. **Database Connection**: MongoDB connections are reused across serverless function invocations for better performance.

2. **Cold Starts**: The first request to your API might be slower due to serverless cold starts. Subsequent requests will be faster.

3. **Function Timeout**: Vercel's free tier has a 10-second timeout for serverless functions. Pro plan has 60 seconds.

4. **Environment Variables**: Make sure all required environment variables are set in the Vercel dashboard under Project Settings → Environment Variables.

## Testing Locally with Vercel

You can test the Vercel configuration locally:

```bash
vercel dev
```

This will start a local server that mimics Vercel's serverless environment.

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (>=18.0.0)

### API Not Working
- Verify environment variables are set correctly
- Check Vercel function logs in the dashboard
- Ensure MongoDB connection string is correct

### CORS Issues
- Update `CORS_ORIGIN` environment variable with your Vercel domain
- Or modify the CORS configuration in `backend/src/index.js`

## Alternative: Separate Deployments

If you prefer to deploy frontend and backend separately:

1. **Frontend on Vercel**: Deploy the root directory (already configured)
2. **Backend on Railway/Render**: Deploy the `backend` directory separately

Then update the frontend API URLs to point to your backend URL.

