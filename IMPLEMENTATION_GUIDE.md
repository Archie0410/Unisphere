# 🎓 UniSphere - Implementation Guide

## 📋 Overview

This guide shows how UniSphere was implemented step-by-step - a university recommendation and career guidance platform with AI-powered features.

## 🏗️ Architecture

```
Backend (Node.js/Express) ←→ Frontend (React/TypeScript)
├── API Routes (RESTful)     ├── Components (UI)
├── AI Services (Gemini)     ├── Pages (Views)  
├── Authentication (JWT)     ├── Services (API calls)
└── Database (Mock/Sequelize)└── State Management
```

## 🚀 Implementation Steps

### **Phase 1: Backend Foundation**

#### **1.1 Project Setup**
```bash
mkdir backend && cd backend
npm init -y
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken
```

#### **1.2 Basic Server (`src/index.js`)**
```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

#### **1.3 Environment Configuration (`env.example`)**
```bash
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGIN=http://localhost:3000
```

### **Phase 2: Authentication System**

#### **2.1 JWT Middleware (`src/middleware/auth.js`)**
```javascript
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

#### **2.2 Auth Routes (`src/routes/auth.js`)**
```javascript
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user (simplified)
    const user = { id: 1, email, name, password: hashedPassword };
    
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    res.json({
      success: true,
      data: { user: { id: user.id, email, name }, accessToken }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

export default router;
```

### **Phase 3: AI Integration**

#### **3.1 Gemini AI Service (`src/services/geminiService.js`)**
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async sendMessage(message, userContext = {}) {
    try {
      let enhancedMessage = message;
      if (userContext.academicBackground || userContext.interests) {
        enhancedMessage = `Context: ${JSON.stringify(userContext)}\n\nStudent Question: ${message}`;
      }

      const result = await this.model.generateContent(enhancedMessage);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        response: text,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        response: "I'm having trouble connecting to my AI services right now.",
        error: error.message
      };
    }
  }
}

export default new GeminiService();
```

#### **3.2 Career Routes (`src/routes/career.js`)**
```javascript
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import geminiService from '../services/geminiService.js';

const router = express.Router();

router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message, userContext } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message required' });
    }

    const result = await geminiService.sendMessage(message, userContext);
    
    res.json({
      success: result.success,
      data: { response: result.response, timestamp: result.timestamp }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Chat request failed' });
  }
});

export default router;
```

### **Phase 4: University Data System**

#### **4.1 University Service (`src/services/universityService.js`)**
```javascript
const mockUniversities = [
  {
    id: 1,
    name: 'Massachusetts Institute of Technology (MIT)',
    location: 'Cambridge, MA, USA',
    ranking: 1,
    acceptanceRate: 7.3,
    tuition: 55000,
    programs: ['Computer Science', 'Engineering', 'Physics', 'Mathematics'],
    website: 'https://mit.edu',
    description: 'World-renowned institution for science and technology education.'
  },
  {
    id: 2,
    name: 'Stanford University',
    location: 'Stanford, CA, USA',
    ranking: 2,
    acceptanceRate: 4.3,
    tuition: 56000,
    programs: ['Computer Science', 'Business', 'Engineering', 'Medicine'],
    website: 'https://stanford.edu',
    description: 'Leading research university in the heart of Silicon Valley.'
  }
  // ... more universities
];

class UniversityService {
  async getAllUniversities(filters = {}) {
    try {
      let filteredUniversities = [...mockUniversities];

      if (filters.location) {
        filteredUniversities = filteredUniversities.filter(uni => 
          uni.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.program) {
        filteredUniversities = filteredUniversities.filter(uni => 
          uni.programs.some(program => 
            program.toLowerCase().includes(filters.program.toLowerCase())
          )
        );
      }

      return {
        success: true,
        data: filteredUniversities,
        total: filteredUniversities.length
      };
    } catch (error) {
      return { success: false, error: 'Failed to retrieve universities', data: [] };
    }
  }

  async searchUniversities(query, limit = 10) {
    try {
      const searchTerm = query.toLowerCase();
      const results = mockUniversities.filter(uni => 
        uni.name.toLowerCase().includes(searchTerm) ||
        uni.description.toLowerCase().includes(searchTerm) ||
        uni.location.toLowerCase().includes(searchTerm)
      ).slice(0, limit);

      return {
        success: true,
        data: results,
        total: results.length,
        query: query
      };
    } catch (error) {
      return { success: false, error: 'Search failed', data: [] };
    }
  }

  async getRecommendations(studentProfile) {
    try {
      const { interests, budget, location } = studentProfile;
      
      let recommendations = [...mockUniversities];

      if (budget) {
        recommendations = recommendations.filter(uni => uni.tuition <= budget);
      }

      if (location) {
        recommendations = recommendations.filter(uni => 
          uni.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (interests && interests.length > 0) {
        recommendations = recommendations.filter(uni => 
          uni.programs.some(program => 
            interests.some(interest => 
              program.toLowerCase().includes(interest.toLowerCase())
            )
          )
        );
      }

      recommendations.sort((a, b) => a.ranking - b.ranking);
      recommendations = recommendations.slice(0, 5);

      return {
        success: true,
        data: recommendations,
        total: recommendations.length
      };
    } catch (error) {
      return { success: false, error: 'Recommendations failed', data: [] };
    }
  }
}

export default new UniversityService();
```

#### **4.2 University Routes (`src/routes/university.js`)**
```javascript
import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import universityService from '../services/universityService.js';

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const filters = {
      location: req.query.location,
      program: req.query.program,
      maxTuition: req.query.maxTuition ? parseInt(req.query.maxTuition) : null
    };

    const result = await universityService.getAllUniversities(filters);
    
    res.json({
      success: true,
      message: 'Universities retrieved successfully',
      data: result.data,
      total: result.total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve universities' });
  }
});

router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, limit } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const result = await universityService.searchUniversities(q, limit ? parseInt(limit) : 10);
    
    res.json({
      success: true,
      message: 'Search completed successfully',
      data: result.data,
      total: result.total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Search failed' });
  }
});

router.post('/recommend', authenticateToken, async (req, res) => {
  try {
    const studentProfile = req.body;
    
    if (!studentProfile) {
      return res.status(400).json({ success: false, message: 'Student profile required' });
    }

    const result = await universityService.getRecommendations(studentProfile);
    
    res.json({
      success: true,
      message: 'Recommendations generated successfully',
      data: result.data,
      total: result.total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Recommendations failed' });
  }
});

export default router;
```

### **Phase 5: Main Server Integration**

#### **5.1 Complete Server (`src/index.js`)**
```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import universityRoutes from './routes/university.js';
import careerRoutes from './routes/career.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
const API_VERSION = process.env.API_VERSION || 'v1';
const apiPrefix = `/api/${API_VERSION}`;

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/university`, universityRoutes);
app.use(`${apiPrefix}/career`, careerRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}${apiPrefix}`);
});
```

### **Phase 6: Frontend Implementation**

#### **6.1 API Service (`src/services/api.ts`)**
```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const universityAPI = {
  getAll: (filters?: any) => api.get('/university', { params: filters }),
  search: (query: string) => api.get('/university/search', { params: { q: query } }),
  getRecommendations: (profile: any) => api.post('/university/recommend', profile)
};

export const careerAPI = {
  chat: (message: string, context?: any) => 
    api.post('/career/chat', { message, userContext: context })
};

export default api;
```

#### **6.2 University Component (`src/components/UniversityRecommendations.tsx`)**
```typescript
import React, { useState, useEffect } from 'react';
import { universityAPI } from '../services/api';

interface University {
  id: number;
  name: string;
  location: string;
  ranking: number;
  acceptanceRate: number;
  tuition: number;
  programs: string[];
  website: string;
  description: string;
}

const UniversityRecommendations: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    try {
      setLoading(true);
      const response = await universityAPI.getAll();
      setUniversities(response.data.data);
    } catch (error) {
      console.error('Failed to load universities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading universities...</div>;

  return (
    <div className="university-recommendations">
      <h2>Top Universities</h2>
      <div className="universities-grid">
        {universities.map((university) => (
          <div key={university.id} className="university-card">
            <h3>{university.name}</h3>
            <p className="location">{university.location}</p>
            <p className="ranking">Ranking: #{university.ranking}</p>
            <p className="acceptance-rate">
              Acceptance Rate: {university.acceptanceRate}%
            </p>
            <p className="tuition">Tuition: ${university.tuition.toLocaleString()}</p>
            <div className="programs">
              <strong>Programs:</strong>
              <ul>
                {university.programs.map((program, index) => (
                  <li key={index}>{program}</li>
                ))}
              </ul>
            </div>
            <a href={university.website} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniversityRecommendations;
```

#### **6.3 Career Counseling Component (`src/components/CareerCounseling.tsx`)**
```typescript
import React, { useState } from 'react';
import { careerAPI } from '../services/api';

const CareerCounseling: React.FC = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setLoading(true);
      const result = await careerAPI.chat(message);
      setResponse(result.data.data.response);
    } catch (error) {
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-counseling">
      <h2>AI Career Counselor</h2>
      <div className="chat-container">
        {response && (
          <div className="ai-response">
            <strong>AI Counselor:</strong>
            <p>{response}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="chat-input">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me about your career path, university choices, or any educational guidance..."
            rows={3}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Thinking...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CareerCounseling;
```

## 🚀 **Running the Application**

### **Backend:**
```bash
cd backend
cp env.example .env
# Add your API keys to .env
npm install
npm run dev
```

### **Frontend:**
```bash
cd frontend
npm install
npm start
```

## 📊 **Key Features Implemented**

### **✅ Backend:**
- JWT Authentication
- Google Gemini AI Integration
- University Data with Search/Filter
- RESTful API Endpoints
- Rate Limiting & Security
- Error Handling

### **✅ Frontend:**
- University Display Grid
- Search Functionality
- AI Chat Interface
- Responsive Design
- API Integration

### **✅ Integration:**
- Real-time API Communication
- Authentication Flow
- Error Management
- Loading States

## 🔧 **API Endpoints**

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/university` - Get universities
- `GET /api/v1/university/search` - Search universities
- `POST /api/v1/university/recommend` - Get recommendations
- `POST /api/v1/career/chat` - AI career counseling

## 🎯 **Next Steps**

1. **Database Integration** - Replace mock data
2. **Email Service** - Add notifications
3. **File Upload** - Profile pictures
4. **Advanced AI** - Better recommendations
5. **Real-time Features** - WebSocket chat
6. **Mobile App** - React Native

This implementation provides a complete foundation for a university recommendation platform with AI-powered career guidance.
