import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import aiService from '../services/aiService.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   GET /api/v1/career/test
// @desc    Test endpoint to check if API is working
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Career API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      chat: 'POST /api/v1/career/chat',
      insights: 'POST /api/v1/career/insights',
      recommendations: 'POST /api/v1/career/recommendations'
    }
  });
});

// @route   POST /api/v1/career/chat
// @desc    Get career guidance from AI
// @access  Private
router.post('/chat', 
  optionalAuth, 
  [
    body('message').notEmpty().withMessage('Message is required'),
    body('message').isLength({ max: 1000 }).withMessage('Message too long (max 1000 characters)')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { message, userContext, resetChat } = req.body;
      
      // Get user context if authenticated
      const context = userContext || {};
      if (req.user) {
        context.userId = req.user.id;
        // You can add more user context here from database
      }

      const result = await aiService.sendMessage(message, context);

      // If AI service failed, still return the fallback response but with success: false
      if (!result.success) {
        return res.status(503).json({
          success: false,
          message: 'AI service is currently unavailable. Please try again later.',
          data: {
            response: result.response,
            timestamp: result.timestamp,
            provider: result.provider || 'Fallback'
          }
        });
      }

      res.json({
        success: result.success,
        message: 'Career guidance provided successfully',
        data: {
          response: result.response,
          timestamp: result.timestamp,
          provider: result.provider || 'Gemini'
        }
      });

    } catch (error) {
      console.error('Career chat error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get career guidance',
        error: error.message
      });
    }
  }
);

// @route   POST /api/v1/career/insights
// @desc    Get career insights for specific field
// @access  Public
router.post('/insights', 
  [
    body('field').notEmpty().withMessage('Field is required'),
    body('field').isLength({ max: 100 }).withMessage('Field name too long')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { field } = req.body;
      const result = await aiService.getCareerInsights(field);

      // If AI service failed, still return the fallback response but with success: false
      if (!result.success) {
        return res.status(503).json({
          success: false,
          message: 'AI service is currently unavailable. Please try again later.',
          data: {
            insights: result.insights,
            field: result.field,
            timestamp: result.timestamp,
            provider: result.provider || 'Fallback'
          }
        });
      }

      res.json({
        success: result.success,
        message: 'Career insights retrieved successfully',
        data: {
          insights: result.insights,
          field: result.field,
          timestamp: result.timestamp,
          provider: result.provider || 'Gemini'
        }
      });

    } catch (error) {
      console.error('Career insights error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get career insights',
        error: error.message
      });
    }
  }
);

// @route   POST /api/v1/career/recommendations
// @desc    Get university recommendations based on career goals
// @access  Public
router.post('/recommendations', 
  [
    body('careerGoal').notEmpty().withMessage('Career goal is required'),
    body('careerGoal').isLength({ max: 200 }).withMessage('Career goal too long')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { careerGoal, preferences } = req.body;
      const result = await aiService.getUniversityRecommendations(careerGoal, preferences);

      res.json({
        success: result.success,
        message: result.success ? 'University recommendations retrieved successfully' : 'Failed to get recommendations',
        data: {
          recommendations: result.recommendations,
          careerGoal: result.careerGoal,
          timestamp: result.timestamp
        }
      });

    } catch (error) {
      console.error('University recommendations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get university recommendations',
        error: error.message
      });
    }
  }
);

export default router;
