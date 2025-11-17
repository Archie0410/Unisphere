# 🎓 UniSphere - Environment Setup Guide

## 📋 Summary

This guide provides all the environment variables needed to run the UniSphere application and fixes for API issues.

## 🔧 Essential Environment Variables (Must Configure)

### 1. **JWT Authentication** (Critical)
```bash
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_make_it_different_from_jwt_secret
JWT_REFRESH_EXPIRES_IN=30d
```

### 2. **AI Service** (Primary Feature)
```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### 3. **Security**
```bash
SESSION_SECRET=your_session_secret_here_make_it_random
CORS_ORIGIN=http://localhost:3000
```

### 4. **Server Configuration**
```bash
NODE_ENV=development
PORT=5000
API_VERSION=v1
```

## 🗄️ Database Configuration (Optional for Demo Mode)

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=edupath_ai
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_DIALECT=postgres
```

## 📧 Email Configuration (Optional)

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_FROM=UniSphere <noreply@unisphere.ai>
```

## 🚀 Quick Setup Instructions

### Option 1: Automated Setup (Recommended)
```bash
cd backend
npm run setup
```

### Option 2: Manual Setup
```bash
cd backend
cp env.example .env
# Edit .env file with your values
```

## 🔑 API Keys Required

### 1. **Google Gemini AI** (Essential)
- **Purpose**: AI-powered career counseling and recommendations
- **Get it from**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Cost**: Free tier available
- **Usage**: Career guidance, university recommendations, personalized advice

### 2. **PostgreSQL Database** (Optional)
- **Purpose**: User data, profiles, preferences
- **Alternatives**: 
  - Use SQLite for development
  - Run in demo mode without database
- **Setup**: Install PostgreSQL or use Docker

### 3. **Gmail SMTP** (Optional)
- **Purpose**: Email notifications, verification emails
- **Setup**: Enable 2FA and generate App Password
- **Alternative**: Use other SMTP providers

## 🛠️ API Issues Fixed

### 1. **University API Implementation**
- ✅ Created comprehensive `universityService.js`
- ✅ Added mock data for 8 top universities
- ✅ Implemented search, filtering, and recommendations
- ✅ Added statistics and ranking features
- ✅ Prepared for external API integration

### 2. **Enhanced Routes**
- ✅ Updated university routes with full functionality
- ✅ Added proper error handling
- ✅ Implemented filtering and search capabilities
- ✅ Added statistics endpoint

### 3. **Service Architecture**
- ✅ Created modular service structure
- ✅ Added fallback mechanisms for API failures
- ✅ Implemented proper logging
- ✅ Added data validation

## 📊 Mock Data Included

The application now includes comprehensive mock data for:

### Universities
- MIT, Stanford, Harvard, UC Berkeley
- Oxford, Cambridge, ETH Zurich, University of Toronto
- Complete with rankings, tuition, programs, acceptance rates

### Features
- Search functionality
- Filtering by location, program, budget, ranking
- Personalized recommendations
- Statistics and analytics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Cross-origin security
- **Input Validation**: Request sanitization
- **Error Handling**: Comprehensive error management

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
npm run setup
# This will generate secure secrets automatically
```

### 3. Configure API Keys
Edit `.env` file and add:
- `GEMINI_API_KEY` (get from Google AI Studio)
- Database credentials (optional)
- Email settings (optional)

### 4. Start the Server
```bash
npm run dev
```

### 5. Test the API
```bash
# Health check
curl http://localhost:5000/health

# Get universities
curl http://localhost:5000/api/v1/university

# Search universities
curl "http://localhost:5000/api/v1/university/search?q=MIT"
```

## 📝 Environment Variables Reference

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | ✅ | Google Gemini AI API key | - |
| `JWT_SECRET` | ✅ | JWT signing secret | Auto-generated |
| `JWT_REFRESH_SECRET` | ✅ | JWT refresh secret | Auto-generated |
| `SESSION_SECRET` | ✅ | Session encryption | Auto-generated |
| `NODE_ENV` | ❌ | Environment mode | `development` |
| `PORT` | ❌ | Server port | `5000` |
| `CORS_ORIGIN` | ❌ | Allowed origins | `http://localhost:3000` |
| `DB_HOST` | ❌ | Database host | `localhost` |
| `EMAIL_HOST` | ❌ | SMTP host | `smtp.gmail.com` |
| `REDIS_URL` | ❌ | Redis URL | `redis://localhost:6379` |

## 🆘 Troubleshooting

### Common Issues

1. **"JWT_SECRET not configured"**
   - Run `npm run setup` to generate secrets
   - Or manually set JWT_SECRET in .env

2. **"Gemini API key invalid"**
   - Get a valid key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Check API key format and permissions

3. **"Database connection failed"**
   - Application runs in demo mode without database
   - Install PostgreSQL or use Docker for full functionality

4. **"CORS errors"**
   - Check CORS_ORIGIN in .env matches your frontend URL
   - Default: `http://localhost:3000`

### Demo Mode
The application can run in demo mode with:
- ✅ AI-powered features (with Gemini API key)
- ✅ University recommendations (mock data)
- ✅ Career counseling
- ✅ User authentication
- ❌ Persistent data storage (requires database)

## 📞 Support

For additional help:
1. Check the backend README.md
2. Review API documentation
3. Check environment configuration
4. Verify API keys and permissions
