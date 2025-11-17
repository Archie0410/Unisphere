import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import universityService from '../services/universityService.js';

const router = express.Router();

// @route   GET /api/v1/university
// @desc    Get all universities with optional filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const filters = {
      location: req.query.location,
      program: req.query.program,
      maxTuition: req.query.maxTuition ? parseInt(req.query.maxTuition) : null,
      minRanking: req.query.minRanking ? parseInt(req.query.minRanking) : null
    };

    const result = await universityService.getAllUniversities(filters);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Universities retrieved successfully',
        data: result.data,
        total: result.total,
        filters: result.filters
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve universities'
    });
  }
});

// @route   GET /api/v1/university/search
// @desc    Search universities
// @access  Public
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, limit } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const result = await universityService.searchUniversities(q, limit ? parseInt(limit) : 10);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Search completed successfully',
        data: result.data,
        total: result.total,
        query: result.query
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search universities'
    });
  }
});

// @route   GET /api/v1/university/:id
// @desc    Get university by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await universityService.getUniversityById(id);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'University retrieved successfully',
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve university'
    });
  }
});

// @route   POST /api/v1/university/recommend
// @desc    Get university recommendations based on student profile
// @access  Private
router.post('/recommend', authenticateToken, async (req, res) => {
  try {
    const studentProfile = req.body;
    
    // Validate required fields
    if (!studentProfile) {
      return res.status(400).json({
        success: false,
        message: 'Student profile is required'
      });
    }

    const result = await universityService.getRecommendations(studentProfile);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Recommendations generated successfully',
        data: result.data,
        total: result.total,
        profile: result.profile
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations'
    });
  }
});

// @route   GET /api/v1/university/stats/statistics
// @desc    Get university statistics
// @access  Public
router.get('/stats/statistics', optionalAuth, async (req, res) => {
  try {
    const result = await universityService.getStatistics();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics'
    });
  }
});

export default router;
