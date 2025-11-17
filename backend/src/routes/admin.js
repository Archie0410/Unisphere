import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply admin role requirement to all routes
router.use(authenticateToken, requireRole('admin'));

// @route   GET /api/v1/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Admin
router.get('/dashboard', async (req, res) => {
  try {
    // TODO: Implement admin dashboard
    res.json({
      success: true,
      message: 'Admin dashboard endpoint - to be implemented',
      data: {
        stats: {}
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get admin dashboard'
    });
  }
});

export default router;
