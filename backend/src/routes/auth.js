import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { getModels } from '../models/index.js';

// Get User model when available
const getUserModel = () => {
  const models = getModels();
  return models.User;
};

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('superheroName').optional().trim().isLength({ min: 2 }).withMessage('Superhero name must be at least 2 characters long'),
  body('powerLevel').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Legendary']).withMessage('Invalid power level')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Register new hero
router.post('/register', validateRegistration, async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, name, superheroName, powerLevel } = req.body;

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const UserModel = getUserModel();
    if (!UserModel) {
      return res.status(500).json({
        success: false,
        message: 'Database models not initialized'
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({
        success: false,
        message: 'A hero with this email already exists!'
      });
    }
    console.log('No existing user found, proceeding with registration');

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    console.log('Creating new user with data:', { email, name, superheroName, powerLevel });
    const user = await UserModel.create({
      email,
      password: hashedPassword,
      name,
      superheroName,
      powerLevel: powerLevel || 'Beginner',
      achievements: ['Hero Registration', 'First Mission'],
      stats: {
        universitiesExplored: 0,
        roadmapsCreated: 0,
        careerQuestions: 0,
        favorites: 0
      }
    });
    console.log('User created successfully:', user._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      superheroName: user.superheroName,
      powerLevel: user.powerLevel,
      avatar: user.avatar,
      joinDate: user.joinDate,
      achievements: user.achievements,
      stats: user.stats,
      profileCompleted: user.profileCompleted,
      academicProfile: user.academicProfile,
      lastLogin: user.lastLogin
    };

    res.status(201).json({
      success: true,
      message: '🌟 Hero Registration Complete! Welcome to the league!',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: '⚠️ Mission Failed: Unable to register hero',
      error: error.message
    });
  }
});

// Login hero
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const UserModel = getUserModel();
    if (!UserModel) {
      return res.status(500).json({
        success: false,
        message: 'Database models not initialized'
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '⚠️ Hero not found! Please check your credentials.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: '⚠️ Hero account is deactivated!'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '⚠️ Invalid secret credentials!'
      });
    }

    // Update last login
    await UserModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      superheroName: user.superheroName,
      powerLevel: user.powerLevel,
      avatar: user.avatar,
      joinDate: user.joinDate,
      achievements: user.achievements,
      stats: user.stats,
      profileCompleted: user.profileCompleted,
      academicProfile: user.academicProfile,
      lastLogin: user.lastLogin
    };

    res.json({
      success: true,
      message: `🦸‍♂️ Hero Mode Activated! Welcome back, ${user.superheroName}!`,
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '⚠️ Mission Failed: Unable to activate hero mode',
      error: error.message
    });
  }
});

// Get hero profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '⚠️ Access denied! No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const UserModel = getUserModel();
    if (!UserModel) {
      return res.status(500).json({
        success: false,
        message: 'Database models not initialized'
      });
    }
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '⚠️ Hero not found!'
      });
    }

    // Remove password from response
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      superheroName: user.superheroName,
      powerLevel: user.powerLevel,
      avatar: user.avatar,
      joinDate: user.joinDate,
      achievements: user.achievements,
      stats: user.stats,
      lastLogin: user.lastLogin,
      preferences: user.preferences
    };

    res.json({
      success: true,
      message: 'Hero profile retrieved successfully!',
      data: userResponse
    });

  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({
      success: false,
      message: '⚠️ Mission Failed: Unable to retrieve hero profile',
      error: error.message
    });
  }
});

// Update hero profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '⚠️ Access denied! No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const UserModel = getUserModel();
    if (!UserModel) {
      return res.status(500).json({
        success: false,
        message: 'Database models not initialized'
      });
    }
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '⚠️ Hero not found!'
      });
    }

    const { name, superheroName, powerLevel, preferences } = req.body;

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        name: name || user.name,
        superheroName: superheroName || user.superheroName,
        powerLevel: powerLevel || user.powerLevel,
        preferences: preferences || user.preferences
      },
      { new: true }
    );

    // Remove password from response
    const userResponse = {
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      superheroName: updatedUser.superheroName,
      powerLevel: updatedUser.powerLevel,
      avatar: updatedUser.avatar,
      joinDate: updatedUser.joinDate,
      achievements: updatedUser.achievements,
      stats: updatedUser.stats,
      lastLogin: updatedUser.lastLogin,
      preferences: updatedUser.preferences
    };

    res.json({
      success: true,
      message: '🦸‍♂️ Hero profile updated successfully!',
      data: userResponse
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: '⚠️ Mission Failed: Unable to update hero profile',
      error: error.message
    });
  }
});

// Update hero stats
router.put('/stats', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '⚠️ Access denied! No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const UserModel = getUserModel();
    if (!UserModel) {
      return res.status(500).json({
        success: false,
        message: 'Database models not initialized'
      });
    }
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '⚠️ Hero not found!'
      });
    }

    const { stats, achievements } = req.body;

    // Update stats and achievements
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        stats: stats || user.stats,
        achievements: achievements || user.achievements
      },
      { new: true }
    );

    res.json({
      success: true,
      message: '📊 Hero stats updated successfully!',
      data: {
        stats: user.stats,
        achievements: user.achievements
      }
    });

  } catch (error) {
    console.error('Stats update error:', error);
    res.status(500).json({
      success: false,
      message: '⚠️ Mission Failed: Unable to update hero stats',
      error: error.message
    });
  }
});

// Complete hero profile
router.put('/profile/complete', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '⚠️ Access denied! No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const UserModel = getUserModel();
    if (!UserModel) {
      return res.status(500).json({
        success: false,
        message: 'Database models not initialized'
      });
    }
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '⚠️ Hero not found!'
      });
    }

    const { academicProfile } = req.body;

    // Update academic profile and mark as completed
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        academicProfile: academicProfile || user.academicProfile,
        profileCompleted: true
      },
      { new: true }
    );
    
    // Add achievement for profile completion if not already present
    if (!updatedUser.achievements.includes('Profile Master')) {
      const newAchievements = [...updatedUser.achievements, 'Profile Master'];
      await UserModel.findByIdAndUpdate(user._id, { achievements: newAchievements });
      updatedUser.achievements = newAchievements;
    }

    res.json({
      success: true,
      message: '🎯 Hero Profile Complete! Ready for missions!',
      data: {
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          superheroName: updatedUser.superheroName,
          powerLevel: updatedUser.powerLevel,
          avatar: updatedUser.avatar,
          joinDate: updatedUser.joinDate,
          achievements: updatedUser.achievements,
          stats: updatedUser.stats,
          profileCompleted: updatedUser.profileCompleted,
          academicProfile: updatedUser.academicProfile,
          lastLogin: updatedUser.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({
      success: false,
      message: '⚠️ Mission Failed: Unable to complete hero profile',
      error: error.message
    });
  }
});

// Logout hero
router.post('/logout', async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.json({
      success: true,
      message: '👋 Hero mode deactivated! See you next time!'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: '⚠️ Mission Failed: Unable to deactivate hero mode',
      error: error.message
    });
  }
});

export default router;
