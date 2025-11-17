# Career API Testing Guide

## Overview
The "Get AI Insights" button in the CareerCounseling component has been enhanced with full functionality. Here's how to test and use it.

## Features Added

### 1. **Enhanced Button Functionality**
- ✅ Direct API call to `/career/insights` endpoint
- ✅ Fallback to AI chat if insights endpoint fails
- ✅ Loading states and visual feedback
- ✅ Error handling with user-friendly messages
- ✅ Connection status indicator

### 2. **Visual Improvements**
- ✅ Loading spinner during API calls
- ✅ Processing badge on career field cards
- ✅ Ring highlight on active processing card
- ✅ API connection status indicator
- ✅ Toast notifications for success/error states

### 3. **Robust Error Handling**
- ✅ Network error detection
- ✅ Server error handling
- ✅ Graceful fallback to AI chat
- ✅ Detailed error logging

## How to Test

### Prerequisites
1. **Backend Server**: Make sure the backend is running on port 5000
2. **Environment Variables**: Ensure `.env` file is configured with API keys
3. **Frontend**: Start the frontend development server

### Testing Steps

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start the Frontend**:
   ```bash
   npm install
   npm run dev
   ```

3. **Test API Connectivity**:
   ```bash
   node test-career-api.js
   ```

4. **Test the UI**:
   - Navigate to the Career Counseling page
   - Look for the green "Connected" indicator in the AI Career Counselor header
   - Click "Get AI Insights" on any career field card
   - Watch for loading states and responses

### Expected Behavior

#### ✅ Success Case:
- Button shows loading spinner
- Card gets highlighted with ring
- Processing badge appears
- AI response appears in the counselor section
- Success toast notification
- Response added to chat history

#### 🔄 Fallback Case:
- If insights endpoint fails, automatically falls back to AI chat
- User gets notified about using alternative method
- Question is automatically set and sent to AI chat

#### ❌ Error Cases:
- Network errors show appropriate messages
- Server errors are handled gracefully
- User always gets some form of response

## API Endpoints Used

### 1. `/api/v1/career/test`
- **Method**: GET
- **Purpose**: Check API connectivity
- **Response**: Status and available endpoints

### 2. `/api/v1/career/insights`
- **Method**: POST
- **Body**: `{ "field": "Career Field Name" }`
- **Purpose**: Get detailed insights for specific career field
- **Response**: AI-generated career insights

### 3. `/api/v1/career/chat`
- **Method**: POST
- **Body**: `{ "message": "User question" }`
- **Purpose**: General career guidance chat
- **Response**: AI-generated career advice

## Troubleshooting

### Common Issues:

1. **"API is not reachable"**
   - Check if backend server is running on port 5000
   - Verify no firewall blocking the connection

2. **"Career insights service not available"**
   - Check if `/career/insights` endpoint is properly configured
   - Verify AI service (Gemini) API key is set

3. **"Network error"**
   - Check internet connection
   - Verify CORS settings in backend

4. **"Server error"**
   - Check backend logs for detailed error messages
   - Verify all environment variables are set correctly

### Debug Information:
- Check browser console for detailed error logs
- Use the test script: `node test-career-api.js`
- Monitor backend server logs for API call details

## Environment Variables Required

Make sure these are set in your `.env` file:

```bash
# AI Service
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Success Indicators

When everything is working correctly, you should see:

1. ✅ Green "Connected" status in the AI Career Counselor header
2. ✅ Loading states when clicking "Get AI Insights"
3. ✅ Detailed AI responses for career fields
4. ✅ Toast notifications for successful operations
5. ✅ Chat history populated with Q&A pairs

The "Get AI Insights" button now provides a complete, robust user experience with proper error handling and fallback mechanisms!
