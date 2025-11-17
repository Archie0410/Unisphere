# 🗄️ MongoDB Setup Guide for UniSphere

## 📋 Overview

This guide will help you set up MongoDB for the UniSphere application. MongoDB is now the primary database, replacing the previous PostgreSQL setup.

## 🚀 Quick Start

### **Option 1: MongoDB Atlas (Cloud - Recommended)**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier available)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update Environment Variables**
   ```bash
   # In your .env file
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edupath_ai?retryWrites=true&w=majority
   ```

### **Option 2: Local MongoDB Installation**

#### **Windows:**
1. **Download MongoDB Community Server**
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Download the Windows installer
   - Run the installer and follow the setup wizard

2. **Start MongoDB Service**
   ```powershell
   # Start MongoDB service
   net start MongoDB
   
   # Or install as a service
   "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --config "C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg" --install
   ```

3. **Update Environment Variables**
   ```bash
   # In your .env file
   MONGODB_URI=mongodb://localhost:27017/edupath_ai
   ```

#### **macOS:**
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community
```

#### **Linux (Ubuntu):**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 🔧 Configuration

### **Environment Variables**

Update your `.env` file with MongoDB configuration:

```bash
# Database Configuration (MongoDB)
MONGODB_URI=mongodb://localhost:27017/edupath_ai
# Alternative: MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edupath_ai?retryWrites=true&w=majority
```

### **Database Models**

The application now uses MongoDB with Mongoose ODM:

- **User Model**: User accounts and authentication
- **University Model**: University data and programs
- **StudentProfile Model**: Detailed student profiles and preferences

## 🌱 Database Seeding

### **Seed the Database**

```bash
# Navigate to backend directory
cd backend

# Run the seeder
npm run seed
```

This will:
- ✅ Create 3 sample universities (MIT, Stanford, Harvard)
- ✅ Create a test user account
- ✅ Create a sample student profile
- ✅ Set up all necessary indexes

### **Test User Account**

After seeding, you can log in with:
- **Email**: `test@example.com`
- **Password**: `password123`

## 🔍 Database Operations

### **Check Database Connection**

```bash
# Test the API
curl http://localhost:5000/api/v1/university

# Check health endpoint
curl http://localhost:5000/health
```

### **MongoDB Shell Commands**

```bash
# Connect to MongoDB shell
mongosh

# Switch to database
use edupath_ai

# View collections
show collections

# View universities
db.universities.find().pretty()

# View users
db.users.find().pretty()

# View student profiles
db.studentprofiles.find().pretty()
```

## 📊 Database Schema

### **University Collection**
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

### **User Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String (enum: ['student', 'admin']),
  isVerified: Boolean,
  profile: {
    avatar: String,
    bio: String,
    location: String,
    phone: String,
    dateOfBirth: Date,
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

### **StudentProfile Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  academicBackground: {
    currentLevel: String,
    currentInstitution: String,
    gpa: Number,
    satScore: { total: Number, math: Number, reading: Number, writing: Number },
    actScore: { composite: Number, math: Number, english: Number, reading: Number, science: Number },
    toeflScore: Number,
    ieltsScore: Number,
    greScore: { verbal: Number, quantitative: Number, analytical: Number },
    gmatScore: Number,
    academicAchievements: [String],
    researchExperience: [Object],
    publications: [Object]
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
    preferredIndustries: [String],
    salaryExpectations: { min: Number, max: Number, currency: String }
  },
  preferences: {
    studyAbroad: Boolean,
    preferredCountries: [String],
    preferredCities: [String],
    climate: String,
    campusSize: String,
    universityType: String,
    programDuration: String,
    classSize: String
  },
  financial: {
    budget: { min: Number, max: Number, currency: String },
    needScholarship: Boolean,
    scholarshipTypes: [String],
    workStudy: Boolean,
    partTimeWork: Boolean
  },
  languages: [{
    language: String,
    proficiency: String,
    certified: Boolean
  }],
  skills: {
    technical: [String],
    soft: [String],
    languages: [String],
    certifications: [Object]
  },
  workExperience: [Object],
  extracurricular: [Object],
  recommendations: [Object],
  applications: [Object],
  savedUniversities: [Object],
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

## 🔧 Troubleshooting

### **Common Issues**

1. **MongoDB Connection Failed**
   ```bash
   # Check if MongoDB is running
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl status mongod
   ```

2. **Port Already in Use**
   ```bash
   # Check what's using port 27017
   netstat -ano | findstr :27017
   
   # Kill the process
   taskkill /PID <PID> /F
   ```

3. **Authentication Failed**
   ```bash
   # Check your connection string
   # Make sure username and password are correct
   # For Atlas, ensure IP whitelist includes your IP
   ```

4. **Database Not Found**
   ```bash
   # The database will be created automatically when you first connect
   # Run the seeder to populate with initial data
   npm run seed
   ```

### **Reset Database**

```bash
# Clear all data and reseed
npm run seed
```

## 🚀 Next Steps

1. **Install MongoDB** (if using local installation)
2. **Update your `.env` file** with MongoDB URI
3. **Run the seeder**: `npm run seed`
4. **Start the server**: `npm run dev`
5. **Test the API**: `curl http://localhost:5000/api/v1/university`

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [MongoDB University](https://university.mongodb.com/)

---

**🎉 Congratulations!** Your UniSphere application is now running with MongoDB!
