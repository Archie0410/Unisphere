# 🎓 UniSphere - University Recommendation & Career Guidance Platform

A comprehensive AI-powered platform that helps students find their ideal universities and career paths using advanced machine learning algorithms and personalized recommendations.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd dream-uni-finder-main
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Update MongoDB connection string in .env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/edupath_ai?retryWrites=true&w=majority
```

### 4. Start the Backend Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 5. Frontend Setup (Optional)
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### Database Seeding
```bash
cd backend
npm run seed
```

This will create:
- Sample universities (MIT, Stanford, Harvard)
- Test user account: `test@example.com` / `password123`

## 🔧 Environment Variables

### Essential Variables
```bash
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration (MongoDB)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edupath_ai?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=30d

# AI Service (Google Gemini)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

# Security
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=your_session_secret
```

### Optional Variables
```bash
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# External APIs
UNIVERSITY_API_KEY=your_university_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# OpenAI (Alternative AI)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Universities
- `GET /api/v1/university` - Get all universities
- `GET /api/v1/university/search` - Search universities
- `GET /api/v1/university/:id` - Get university by ID
- `GET /api/v1/university/recommendations` - Get personalized recommendations

### User Profile
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile
- `POST /api/v1/user/preferences` - Update preferences

### Career Guidance
- `POST /api/v1/career/assessment` - Career assessment
- `GET /api/v1/career/recommendations` - Career recommendations
- `POST /api/v1/career/roadmap` - Generate career roadmap

### Health Check
- `GET /health` - Server health status

## 🏗️ Project Structure

```
dream-uni-finder-main/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js              # User model
│   │   │   ├── University.js        # University model
│   │   │   ├── StudentProfile.js    # Student profile model
│   │   │   └── index.js             # Model exports
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication routes
│   │   │   ├── university.js        # University routes
│   │   │   ├── user.js              # User routes
│   │   │   ├── career.js            # Career routes
│   │   │   └── roadmap.js           # Roadmap routes
│   │   ├── services/
│   │   │   ├── geminiService.js     # AI service
│   │   │   ├── universityService.js # University service
│   │   │   └── emailService.js      # Email service
│   │   ├── middleware/
│   │   │   ├── auth.js              # Authentication middleware
│   │   │   └── errorHandler.js      # Error handling
│   │   ├── utils/
│   │   │   ├── logger.js            # Logging utility
│   │   │   └── seeder.js            # Database seeder
│   │   └── index.js                 # Main server file
│   ├── package.json
│   └── .env                         # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['student', 'admin']),
  isVerified: Boolean,
  profile: {
    avatar: String,
    bio: String,
    location: String,
    phone: String,
    academicLevel: String,
    interests: [String],
    careerGoals: [String],
    preferredCountries: [String],
    budget: { min: Number, max: Number, currency: String }
  },
  preferences: {
    notifications: { email: Boolean, push: Boolean },
    privacy: { profileVisibility: String }
  },
  lastLogin: Date,
  loginCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### University Collection
```javascript
{
  _id: ObjectId,
  name: String,
  location: {
    country: String,
    city: String,
    state: String,
    coordinates: { latitude: Number, longitude: Number }
  },
  ranking: { global: Number, national: Number },
  acceptanceRate: Number,
  tuition: {
    domestic: { undergraduate: Number, graduate: Number },
    international: { undergraduate: Number, graduate: Number },
    currency: String
  },
  programs: [{
    name: String,
    level: String,
    department: String,
    duration: String,
    tuition: Number,
    requirements: [String],
    description: String
  }],
  website: String,
  description: String,
  images: { logo: String, campus: [String] },
  contact: { email: String, phone: String, address: String },
  statistics: {
    totalStudents: Number,
    internationalStudents: Number,
    studentFacultyRatio: Number,
    graduationRate: Number,
    employmentRate: Number
  },
  facilities: [{
    name: String,
    description: String,
    type: String
  }],
  admissionRequirements: {
    gpa: { min: Number, recommended: Number },
    sat: { min: Number, recommended: Number },
    toefl: { min: Number, recommended: Number },
    documents: [String]
  },
  scholarships: [{
    name: String,
    amount: Number,
    type: String,
    eligibility: [String],
    description: String,
    deadline: Date
  }],
  tags: [String],
  isActive: Boolean,
  featured: Boolean,
  verified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### StudentProfile Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  academicBackground: {
    currentLevel: String,
    currentInstitution: String,
    gpa: Number,
    satScore: { total: Number, math: Number, reading: Number, writing: Number },
    toeflScore: Number,
    academicAchievements: [String]
  },
  interests: {
    academic: [String],
    extracurricular: [String],
    hobbies: [String],
    career: [String]
  },
  careerGoals: {
    shortTerm: [String],
    longTerm: [String],
    dreamCompanies: [String],
    preferredIndustries: [String]
  },
  preferences: {
    studyAbroad: Boolean,
    preferredCountries: [String],
    preferredCities: [String],
    climate: String,
    campusSize: String,
    universityType: String
  },
  financial: {
    budget: { min: Number, max: Number, currency: String },
    needScholarship: Boolean,
    scholarshipTypes: [String]
  },
  languages: [{
    language: String,
    proficiency: String,
    certified: Boolean
  }],
  skills: {
    technical: [String],
    soft: [String],
    languages: [String]
  },
  roadmap: {
    currentStep: String,
    timeline: { targetYear: Number, targetSemester: String },
    milestones: [Object]
  },
  isComplete: Boolean,
  lastUpdated: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **Rate Limiting** - API rate limiting to prevent abuse
- **CORS Protection** - Cross-origin resource sharing configuration
- **Input Validation** - Express-validator for request validation
- **Helmet Security** - Security headers middleware
- **Environment Variables** - Secure configuration management

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Vercel, AWS, etc.)
4. Set production environment variables

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Update API endpoints to point to your backend

## 🧪 Testing

### API Testing
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test user registration
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Password123"}'

# Test user login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'

# Test university endpoint
curl http://localhost:5000/api/v1/university
```

## 📝 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server
npm start           # Start production server
npm run seed        # Seed database with sample data
npm run build       # Build for production
npm test            # Run tests
npm run lint        # Run ESLint
```

### Frontend Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🎯 Features

- **AI-Powered Recommendations** - Personalized university and career recommendations
- **User Profiles** - Comprehensive student profiles with preferences
- **University Database** - Extensive university information and programs
- **Career Assessment** - AI-driven career path analysis
- **Roadmap Generation** - Personalized academic and career roadmaps
- **Secure Authentication** - JWT-based user authentication
- **Responsive Design** - Modern, mobile-friendly interface
- **Real-time Updates** - Live data updates and notifications

---

**🎓 Built with ❤️ for students worldwide**

# Unisphere
